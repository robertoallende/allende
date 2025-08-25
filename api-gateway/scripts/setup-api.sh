#!/bin/bash

# API Gateway Setup Script for Contact Form API
# Unit 8.4: API Gateway Integration with Amplify

set -e  # Exit on any error

# Configuration
API_NAME="contact-form-api"
STAGE_NAME="prod"
RESOURCE_PATH="submit"
HTTP_METHOD="POST"
REGION="${AWS_REGION:-us-east-1}"

# Security Configuration
CORS_ORIGIN="https://allende.ai"
RATE_LIMIT="10"      # requests per minute per IP
BURST_LIMIT="20"     # burst capacity
QUOTA_LIMIT="100"    # requests per day per IP

# Required configuration files
LAMBDA_CONFIG_FILE="lambda/config/lambda-config.json"

echo "🌐 Setting up API Gateway for Contact Form"
echo "API Name: $API_NAME"
echo "Stage: $STAGE_NAME"
echo "Resource: /$RESOURCE_PATH"
echo "Method: $HTTP_METHOD"
echo "Region: $REGION"
echo "CORS Origin: $CORS_ORIGIN"
echo "Rate Limit: $RATE_LIMIT req/min, Burst: $BURST_LIMIT, Quota: $QUOTA_LIMIT/day"
echo ""

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS CLI configured"

# Check dependencies
if [ ! -f "$LAMBDA_CONFIG_FILE" ]; then
    echo "❌ Lambda configuration not found. Please run 'lambda/scripts/setup-lambda.sh' first."
    exit 1
fi

# Load Lambda configuration
LAMBDA_FUNCTION_ARN=$(jq -r '.functionArn' "$LAMBDA_CONFIG_FILE")
LAMBDA_FUNCTION_NAME=$(jq -r '.functionName' "$LAMBDA_CONFIG_FILE")

if [ "$LAMBDA_FUNCTION_ARN" = "null" ] || [ -z "$LAMBDA_FUNCTION_ARN" ]; then
    echo "❌ Lambda Function ARN not found in configuration."
    exit 1
fi

echo "⚡ Lambda Function ARN: $LAMBDA_FUNCTION_ARN"
echo ""

# Get AWS Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "📋 Account ID: $ACCOUNT_ID"

# Step 1: Create REST API
echo "🌐 Creating REST API..."
API_ID=$(aws apigateway create-rest-api \
    --name "$API_NAME" \
    --description "REST API for contact form submissions from conversational email flow" \
    --endpoint-configuration types=REGIONAL \
    --region "$REGION" \
    --query 'id' \
    --output text)

if [ $? -eq 0 ]; then
    echo "✅ REST API created successfully"
    echo "🆔 API ID: $API_ID"
else
    echo "❌ Failed to create REST API"
    exit 1
fi

# Get root resource ID
ROOT_RESOURCE_ID=$(aws apigateway get-resources \
    --rest-api-id "$API_ID" \
    --region "$REGION" \
    --query 'items[?path==`/`].id' \
    --output text)

echo "📁 Root Resource ID: $ROOT_RESOURCE_ID"

# Step 2: Create resource
echo "📁 Creating resource: /$RESOURCE_PATH"
RESOURCE_ID=$(aws apigateway create-resource \
    --rest-api-id "$API_ID" \
    --parent-id "$ROOT_RESOURCE_ID" \
    --path-part "$RESOURCE_PATH" \
    --region "$REGION" \
    --query 'id' \
    --output text)

if [ $? -eq 0 ]; then
    echo "✅ Resource created successfully"
    echo "📁 Resource ID: $RESOURCE_ID"
else
    echo "❌ Failed to create resource"
    exit 1
fi

# Step 3: Create POST method
echo "📝 Creating POST method..."
aws apigateway put-method \
    --rest-api-id "$API_ID" \
    --resource-id "$RESOURCE_ID" \
    --http-method "$HTTP_METHOD" \
    --authorization-type "NONE" \
    --region "$REGION" > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ POST method created successfully"
else
    echo "❌ Failed to create POST method"
    exit 1
fi

# Step 4: Create OPTIONS method for CORS
echo "🔧 Creating OPTIONS method for CORS..."
aws apigateway put-method \
    --rest-api-id "$API_ID" \
    --resource-id "$RESOURCE_ID" \
    --http-method "OPTIONS" \
    --authorization-type "NONE" \
    --region "$REGION" > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ OPTIONS method created successfully"
else
    echo "❌ Failed to create OPTIONS method"
    exit 1
fi

# Step 5: Set up Lambda integration for POST
echo "🔗 Setting up Lambda integration..."
LAMBDA_URI="arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$LAMBDA_FUNCTION_ARN/invocations"

aws apigateway put-integration \
    --rest-api-id "$API_ID" \
    --resource-id "$RESOURCE_ID" \
    --http-method "$HTTP_METHOD" \
    --type "AWS_PROXY" \
    --integration-http-method "POST" \
    --uri "$LAMBDA_URI" \
    --region "$REGION" > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ Lambda integration created successfully"
else
    echo "❌ Failed to create Lambda integration"
    exit 1
fi

# Step 6: Set up OPTIONS integration for CORS
echo "🔧 Setting up OPTIONS integration for CORS..."
aws apigateway put-integration \
    --rest-api-id "$API_ID" \
    --resource-id "$RESOURCE_ID" \
    --http-method "OPTIONS" \
    --type "MOCK" \
    --request-templates '{"application/json":"{\"statusCode\": 200}"}' \
    --region "$REGION" > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ OPTIONS integration created successfully"
else
    echo "❌ Failed to create OPTIONS integration"
    exit 1
fi

# Step 7: Set up method response for POST
echo "📤 Setting up POST method response..."
aws apigateway put-method-response \
    --rest-api-id "$API_ID" \
    --resource-id "$RESOURCE_ID" \
    --http-method "$HTTP_METHOD" \
    --status-code "200" \
    --response-parameters method.response.header.Access-Control-Allow-Origin=false \
    --region "$REGION" > /dev/null

# Add error responses
aws apigateway put-method-response \
    --rest-api-id "$API_ID" \
    --resource-id "$RESOURCE_ID" \
    --http-method "$HTTP_METHOD" \
    --status-code "400" \
    --response-parameters method.response.header.Access-Control-Allow-Origin=false \
    --region "$REGION" > /dev/null

aws apigateway put-method-response \
    --rest-api-id "$API_ID" \
    --resource-id "$RESOURCE_ID" \
    --http-method "$HTTP_METHOD" \
    --status-code "500" \
    --response-parameters method.response.header.Access-Control-Allow-Origin=false \
    --region "$REGION" > /dev/null

echo "✅ POST method responses configured"

# Step 8: Set up method response for OPTIONS (CORS)
echo "🔧 Setting up OPTIONS method response for CORS..."
aws apigateway put-method-response \
    --rest-api-id "$API_ID" \
    --resource-id "$RESOURCE_ID" \
    --http-method "OPTIONS" \
    --status-code "200" \
    --response-parameters method.response.header.Access-Control-Allow-Headers=false,method.response.header.Access-Control-Allow-Methods=false,method.response.header.Access-Control-Allow-Origin=false \
    --region "$REGION" > /dev/null

echo "✅ OPTIONS method response configured"

# Step 9: Set up integration response for OPTIONS (CORS)
echo "🔧 Setting up OPTIONS integration response for CORS..."
aws apigateway put-integration-response \
    --rest-api-id "$API_ID" \
    --resource-id "$RESOURCE_ID" \
    --http-method "OPTIONS" \
    --status-code "200" \
    --response-parameters '{"method.response.header.Access-Control-Allow-Headers":"'"'"'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"'"'","method.response.header.Access-Control-Allow-Methods":"'"'"'POST,OPTIONS'"'"'","method.response.header.Access-Control-Allow-Origin":"'"'"''"$CORS_ORIGIN"''"'"'"}' \
    --region "$REGION" > /dev/null

echo "✅ OPTIONS integration response configured"

# Step 10: Grant API Gateway permission to invoke Lambda
echo "🔐 Granting API Gateway permission to invoke Lambda..."
STATEMENT_ID="apigateway-invoke-lambda-$(date +%s)"
SOURCE_ARN="arn:aws:execute-api:$REGION:$ACCOUNT_ID:$API_ID/*/*"

aws lambda add-permission \
    --function-name "$LAMBDA_FUNCTION_NAME" \
    --statement-id "$STATEMENT_ID" \
    --action "lambda:InvokeFunction" \
    --principal "apigateway.amazonaws.com" \
    --source-arn "$SOURCE_ARN" \
    --region "$REGION" > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ Lambda invoke permission granted"
else
    echo "⚠️  Permission may already exist or failed to grant"
fi

# Step 11: Create deployment
echo "🚀 Creating API deployment..."
DEPLOYMENT_ID=$(aws apigateway create-deployment \
    --rest-api-id "$API_ID" \
    --stage-name "$STAGE_NAME" \
    --stage-description "Production stage for contact form API" \
    --description "Initial deployment of contact form API" \
    --region "$REGION" \
    --query 'id' \
    --output text)

if [ $? -eq 0 ]; then
    echo "✅ API deployment created successfully"
    echo "🚀 Deployment ID: $DEPLOYMENT_ID"
else
    echo "❌ Failed to create API deployment"
    exit 1
fi

# Step 12: Configure throttling (rate limiting)
echo "🛡️  Configuring rate limiting..."
aws apigateway update-stage \
    --rest-api-id "$API_ID" \
    --stage-name "$STAGE_NAME" \
    --patch-ops '[{"op":"replace","path":"/throttle/rateLimit","value":"'$RATE_LIMIT'"},{"op":"replace","path":"/throttle/burstLimit","value":"'$BURST_LIMIT'"}]' \
    --region "$REGION" > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ Rate limiting configured: $RATE_LIMIT req/min, burst $BURST_LIMIT"
else
    echo "⚠️  Rate limiting configuration may have failed"
fi

# Step 13: Generate API endpoint URL
API_ENDPOINT="https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE_NAME/$RESOURCE_PATH"
echo ""
echo "🎉 API Gateway setup complete!"
echo ""
echo "📊 API Configuration:"
echo "   API ID: $API_ID"
echo "   Stage: $STAGE_NAME"
echo "   Endpoint: $API_ENDPOINT"
echo "   CORS Origin: $CORS_ORIGIN"
echo "   Rate Limit: $RATE_LIMIT req/min"
echo "   Burst Limit: $BURST_LIMIT req"
echo ""

# Save configuration
CONFIG_FILE="api-gateway/config/api-config.json"
mkdir -p "$(dirname "$CONFIG_FILE")"

cat > "$CONFIG_FILE" << EOF
{
  "apiName": "$API_NAME",
  "apiId": "$API_ID",
  "stageName": "$STAGE_NAME",
  "resourcePath": "$RESOURCE_PATH",
  "httpMethod": "$HTTP_METHOD",
  "apiEndpoint": "$API_ENDPOINT",
  "lambdaFunctionArn": "$LAMBDA_FUNCTION_ARN",
  "corsOrigin": "$CORS_ORIGIN",
  "rateLimit": $RATE_LIMIT,
  "burstLimit": $BURST_LIMIT,
  "quotaLimit": $QUOTA_LIMIT,
  "region": "$REGION",
  "createdAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo "💾 Configuration saved to: $CONFIG_FILE"
echo ""

# Test API
echo "🧪 Would you like to test the API endpoint? (y/n)"
read -r TEST_API

if [ "$TEST_API" = "y" ] || [ "$TEST_API" = "Y" ]; then
    echo "🔍 Testing API endpoint..."
    
    # Wait a moment for deployment to be ready
    echo "⏳ Waiting for API to be ready..."
    sleep 5
    
    # Test with curl
    TEST_PAYLOAD='{"name":"API Test User","email":"api-test@example.com","message":"This is a test message from the API Gateway setup script to verify the endpoint is working correctly.","verificationPassed":true,"timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}'
    
    echo "📤 Sending test request..."
    RESPONSE=$(curl -s -X POST "$API_ENDPOINT" \
        -H "Content-Type: application/json" \
        -H "Origin: $CORS_ORIGIN" \
        -d "$TEST_PAYLOAD" \
        -w "\nHTTP_STATUS:%{http_code}")
    
    HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
    RESPONSE_BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')
    
    echo "📄 Response Status: $HTTP_STATUS"
    echo "📄 Response Body: $RESPONSE_BODY"
    
    if [ "$HTTP_STATUS" = "200" ]; then
        echo "✅ API test successful!"
        echo "📧 Check your email for the test notification!"
    else
        echo "⚠️  API test returned status $HTTP_STATUS"
        echo "🔧 Check the response for error details"
    fi
fi

echo ""
echo "🎯 Next steps:"
echo "1. Run 'api-gateway/scripts/test-api.sh' for comprehensive testing"
echo "2. Update frontend to use API endpoint: $API_ENDPOINT"
echo "3. Proceed to Unit 8.5 (Frontend Integration)"
echo ""
echo "🔧 API Endpoint for frontend:"
echo "$API_ENDPOINT"
