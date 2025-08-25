#!/bin/bash

# Lambda Setup Script for Contact Form Processor
# Unit 8.3: Lambda Function Development

set -e  # Exit on any error

# Configuration
FUNCTION_NAME="contact-form-processor"
RUNTIME="python3.13"
HANDLER="lambda_function.lambda_handler"
TIMEOUT=30
MEMORY_SIZE=128
REGION="${AWS_REGION:-us-east-1}"

# Required configuration files
IAM_CONFIG_FILE="iam/config/iam-config.json"
SNS_CONFIG_FILE="sns/config/sns-config.json"

echo "⚡ Setting up Lambda Function for Contact Form Processing"
echo "Function: $FUNCTION_NAME"
echo "Runtime: $RUNTIME"
echo "Region: $REGION"
echo ""

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS CLI configured"

# Check dependencies
if [ ! -f "$IAM_CONFIG_FILE" ]; then
    echo "❌ IAM configuration not found. Please run 'iam/scripts/setup-iam.sh' first."
    exit 1
fi

if [ ! -f "$SNS_CONFIG_FILE" ]; then
    echo "❌ SNS configuration not found. Please run 'sns/scripts/setup-sns.sh' first."
    exit 1
fi

# Load configuration
ROLE_ARN=$(jq -r '.roleArn' "$IAM_CONFIG_FILE")
TOPIC_ARN=$(jq -r '.topicArn' "$SNS_CONFIG_FILE")

if [ "$ROLE_ARN" = "null" ] || [ -z "$ROLE_ARN" ]; then
    echo "❌ IAM Role ARN not found in configuration."
    exit 1
fi

if [ "$TOPIC_ARN" = "null" ] || [ -z "$TOPIC_ARN" ]; then
    echo "❌ SNS Topic ARN not found in configuration."
    exit 1
fi

echo "👤 IAM Role ARN: $ROLE_ARN"
echo "📧 SNS Topic ARN: $TOPIC_ARN"
echo ""

# Create deployment package
echo "📦 Creating deployment package..."
cd lambda/src

# Create temporary directory for package
TEMP_DIR=$(mktemp -d)
echo "📁 Using temporary directory: $TEMP_DIR"

# Copy function code
cp lambda_function.py "$TEMP_DIR/"

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "📥 Installing Python dependencies..."
    pip3 install -r requirements.txt -t "$TEMP_DIR/" --quiet
    
    if [ $? -eq 0 ]; then
        echo "✅ Dependencies installed"
    else
        echo "❌ Failed to install dependencies"
        rm -rf "$TEMP_DIR"
        exit 1
    fi
else
    echo "ℹ️  No requirements.txt found, using built-in modules only"
fi

# Create ZIP package
cd "$TEMP_DIR"
ZIP_FILE="contact-form-processor.zip"
zip -r "$ZIP_FILE" . > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ Deployment package created: $ZIP_FILE"
else
    echo "❌ Failed to create deployment package"
    rm -rf "$TEMP_DIR"
    exit 1
fi

# Move back to project root
cd - > /dev/null
cd ../..

# Check if function already exists
FUNCTION_EXISTS=$(aws lambda get-function --function-name "$FUNCTION_NAME" --region "$REGION" 2>/dev/null || echo "NOT_FOUND")

if [ "$FUNCTION_EXISTS" = "NOT_FOUND" ]; then
    # Create new function
    echo "⚡ Creating Lambda function..."
    
    FUNCTION_ARN=$(aws lambda create-function \
        --function-name "$FUNCTION_NAME" \
        --runtime "$RUNTIME" \
        --role "$ROLE_ARN" \
        --handler "$HANDLER" \
        --zip-file "fileb://$TEMP_DIR/$ZIP_FILE" \
        --timeout "$TIMEOUT" \
        --memory-size "$MEMORY_SIZE" \
        --environment Variables="{SNS_TOPIC_ARN=$TOPIC_ARN,LOG_LEVEL=INFO}" \
        --description "Processes contact form submissions from conversational email flow" \
        --region "$REGION" \
        --query 'FunctionArn' \
        --output text)
    
    if [ $? -eq 0 ]; then
        echo "✅ Lambda function created successfully"
        echo "⚡ Function ARN: $FUNCTION_ARN"
    else
        echo "❌ Failed to create Lambda function"
        rm -rf "$TEMP_DIR"
        exit 1
    fi
else
    # Update existing function
    echo "🔄 Updating existing Lambda function..."
    
    aws lambda update-function-code \
        --function-name "$FUNCTION_NAME" \
        --zip-file "fileb://$TEMP_DIR/$ZIP_FILE" \
        --region "$REGION" > /dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Lambda function code updated"
    else
        echo "❌ Failed to update Lambda function code"
        rm -rf "$TEMP_DIR"
        exit 1
    fi
    
    # Update environment variables
    aws lambda update-function-configuration \
        --function-name "$FUNCTION_NAME" \
        --environment Variables="{SNS_TOPIC_ARN=$TOPIC_ARN,LOG_LEVEL=INFO}" \
        --region "$REGION" > /dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Lambda function configuration updated"
    else
        echo "❌ Failed to update Lambda function configuration"
    fi
    
    # Get function ARN
    FUNCTION_ARN=$(aws lambda get-function \
        --function-name "$FUNCTION_NAME" \
        --region "$REGION" \
        --query 'Configuration.FunctionArn' \
        --output text)
fi

# Cleanup temporary files
rm -rf "$TEMP_DIR"
echo "🧹 Cleaned up temporary files"

# Wait for function to be active
echo "⏳ Waiting for function to be active..."
aws lambda wait function-active --function-name "$FUNCTION_NAME" --region "$REGION"

if [ $? -eq 0 ]; then
    echo "✅ Lambda function is active and ready"
else
    echo "⚠️  Function may still be updating, but deployment completed"
fi

# Save configuration
CONFIG_FILE="lambda/config/lambda-config.json"
mkdir -p "$(dirname "$CONFIG_FILE")"

cat > "$CONFIG_FILE" << EOF
{
  "functionName": "$FUNCTION_NAME",
  "functionArn": "$FUNCTION_ARN",
  "runtime": "$RUNTIME",
  "handler": "$HANDLER",
  "roleArn": "$ROLE_ARN",
  "topicArn": "$TOPIC_ARN",
  "region": "$REGION",
  "timeout": $TIMEOUT,
  "memorySize": $MEMORY_SIZE,
  "createdAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo "💾 Configuration saved to: $CONFIG_FILE"
echo ""

# Test function
echo "🧪 Would you like to test the Lambda function? (y/n)"
read -r TEST_FUNCTION

if [ "$TEST_FUNCTION" = "y" ] || [ "$TEST_FUNCTION" = "Y" ]; then
    echo "🔍 Testing Lambda function..."
    
    # Create test payload
    TEST_PAYLOAD='{
        "body": "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"message\":\"This is a test message from the Lambda setup script to verify the function is working correctly.\",\"verificationPassed\":true,\"timestamp\":\"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'\"}"
    }'
    
    # Invoke function
    aws lambda invoke \
        --function-name "$FUNCTION_NAME" \
        --payload "$TEST_PAYLOAD" \
        --region "$REGION" \
        response.json > /dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Lambda function invoked successfully"
        echo "📄 Response:"
        cat response.json | jq .
        rm -f response.json
        echo ""
        echo "📧 Check your email for the test notification!"
    else
        echo "❌ Failed to invoke Lambda function"
    fi
fi

echo ""
echo "🎉 Lambda function setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Run 'lambda/scripts/test-lambda.sh' to test the function"
echo "2. Proceed to Unit 8.4 (API Gateway Integration)"
echo ""
echo "📝 Important files created:"
echo "- $CONFIG_FILE (contains Function ARN for API Gateway)"
echo ""
echo "⚡ Function ARN for API Gateway:"
echo "$FUNCTION_ARN"
echo ""
echo "🔧 Function Summary:"
echo "- Name: $FUNCTION_NAME"
echo "- Runtime: $RUNTIME"
echo "- Handler: $HANDLER"
echo "- Role: $(basename "$ROLE_ARN")"
echo "- SNS Topic: $(basename "$TOPIC_ARN")"
