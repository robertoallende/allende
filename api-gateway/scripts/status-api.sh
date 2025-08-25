#!/bin/bash

# API Gateway Status Check Script
# Monitors API Gateway status, metrics, and configuration

set -e

CONFIG_FILE="api-gateway/config/api-config.json"

echo "📊 API Gateway Status Check"
echo ""

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ API Gateway not configured. Run 'api-gateway/scripts/setup-api.sh' to set up."
    exit 1
fi

# Load configuration
API_NAME=$(jq -r '.apiName' "$CONFIG_FILE")
API_ID=$(jq -r '.apiId' "$CONFIG_FILE")
STAGE_NAME=$(jq -r '.stageName' "$CONFIG_FILE")
API_ENDPOINT=$(jq -r '.apiEndpoint' "$CONFIG_FILE")
CORS_ORIGIN=$(jq -r '.corsOrigin' "$CONFIG_FILE")
RATE_LIMIT=$(jq -r '.rateLimit' "$CONFIG_FILE")
BURST_LIMIT=$(jq -r '.burstLimit' "$CONFIG_FILE")
REGION=$(jq -r '.region' "$CONFIG_FILE")
CREATED_AT=$(jq -r '.createdAt' "$CONFIG_FILE")

echo "🌐 API Name: $API_NAME"
echo "🆔 API ID: $API_ID"
echo "🚀 Stage: $STAGE_NAME"
echo "🔗 Endpoint: $API_ENDPOINT"
echo "🔒 CORS Origin: $CORS_ORIGIN"
echo "🛡️  Rate Limit: $RATE_LIMIT req/min, Burst: $BURST_LIMIT"
echo "📍 Region: $REGION"
echo "📅 Created: $CREATED_AT"
echo ""

# Check API Gateway status
echo "🔍 Checking API Gateway status..."
API_INFO=$(aws apigateway get-rest-api --rest-api-id "$API_ID" --region "$REGION" --output json 2>/dev/null)

if [ $? -eq 0 ]; then
    echo "✅ API Gateway is active"
    
    # Extract API details
    API_DESCRIPTION=$(echo "$API_INFO" | jq -r '.description // "N/A"')
    ENDPOINT_TYPE=$(echo "$API_INFO" | jq -r '.endpointConfiguration.types[0] // "N/A"')
    CREATED_DATE=$(echo "$API_INFO" | jq -r '.createdDate // "N/A"')
    
    echo "   Description: $API_DESCRIPTION"
    echo "   Endpoint Type: $ENDPOINT_TYPE"
    echo "   Created Date: $CREATED_DATE"
else
    echo "❌ API Gateway not found or not accessible"
    exit 1
fi

# Check stage configuration
echo ""
echo "🚀 Checking stage configuration..."
STAGE_INFO=$(aws apigateway get-stage --rest-api-id "$API_ID" --stage-name "$STAGE_NAME" --region "$REGION" --output json 2>/dev/null)

if [ $? -eq 0 ]; then
    echo "✅ Stage is active"
    
    # Extract stage details
    STAGE_DESCRIPTION=$(echo "$STAGE_INFO" | jq -r '.description // "N/A"')
    DEPLOYMENT_ID=$(echo "$STAGE_INFO" | jq -r '.deploymentId // "N/A"')
    LAST_UPDATED=$(echo "$STAGE_INFO" | jq -r '.lastUpdatedDate // "N/A"')
    
    # Extract throttling settings
    CURRENT_RATE_LIMIT=$(echo "$STAGE_INFO" | jq -r '.throttleSettings.rateLimit // "N/A"')
    CURRENT_BURST_LIMIT=$(echo "$STAGE_INFO" | jq -r '.throttleSettings.burstLimit // "N/A"')
    
    echo "   Description: $STAGE_DESCRIPTION"
    echo "   Deployment ID: $DEPLOYMENT_ID"
    echo "   Last Updated: $LAST_UPDATED"
    echo "   Rate Limit: $CURRENT_RATE_LIMIT req/min"
    echo "   Burst Limit: $CURRENT_BURST_LIMIT req"
else
    echo "❌ Stage not found or not accessible"
fi

# Check resources and methods
echo ""
echo "📁 Checking API resources and methods..."
RESOURCES=$(aws apigateway get-resources --rest-api-id "$API_ID" --region "$REGION" --output json 2>/dev/null)

if [ $? -eq 0 ]; then
    RESOURCE_COUNT=$(echo "$RESOURCES" | jq '.items | length')
    echo "📊 Found $RESOURCE_COUNT resource(s)"
    
    echo ""
    echo "📋 Resource Details:"
    echo "$RESOURCES" | jq -r '.items[] | "   Path: \(.path), Methods: \(.resourceMethods // {} | keys | join(", "))"'
else
    echo "❌ Failed to retrieve resources"
fi

# Check recent API metrics
echo ""
echo "📈 Recent API Metrics (last 24 hours):"
END_TIME=$(date -u +%Y-%m-%dT%H:%M:%S)
START_TIME=$(date -u -d '24 hours ago' +%Y-%m-%dT%H:%M:%S)

# Get request count
REQUESTS=$(aws cloudwatch get-metric-statistics \
    --namespace AWS/ApiGateway \
    --metric-name Count \
    --dimensions Name=ApiName,Value="$API_NAME" \
    --start-time "$START_TIME" \
    --end-time "$END_TIME" \
    --period 86400 \
    --statistics Sum \
    --region "$REGION" \
    --query 'Datapoints[0].Sum' \
    --output text 2>/dev/null || echo "0")

# Get error count
ERRORS=$(aws cloudwatch get-metric-statistics \
    --namespace AWS/ApiGateway \
    --metric-name 4XXError \
    --dimensions Name=ApiName,Value="$API_NAME" \
    --start-time "$START_TIME" \
    --end-time "$END_TIME" \
    --period 86400 \
    --statistics Sum \
    --region "$REGION" \
    --query 'Datapoints[0].Sum' \
    --output text 2>/dev/null || echo "0")

# Get server errors
SERVER_ERRORS=$(aws cloudwatch get-metric-statistics \
    --namespace AWS/ApiGateway \
    --metric-name 5XXError \
    --dimensions Name=ApiName,Value="$API_NAME" \
    --start-time "$START_TIME" \
    --end-time "$END_TIME" \
    --period 86400 \
    --statistics Sum \
    --region "$REGION" \
    --query 'Datapoints[0].Sum' \
    --output text 2>/dev/null || echo "0")

# Get latency
LATENCY=$(aws cloudwatch get-metric-statistics \
    --namespace AWS/ApiGateway \
    --metric-name Latency \
    --dimensions Name=ApiName,Value="$API_NAME" \
    --start-time "$START_TIME" \
    --end-time "$END_TIME" \
    --period 86400 \
    --statistics Average \
    --region "$REGION" \
    --query 'Datapoints[0].Average' \
    --output text 2>/dev/null || echo "0")

echo "   Total Requests: ${REQUESTS:-0}"
echo "   Client Errors (4XX): ${ERRORS:-0}"
echo "   Server Errors (5XX): ${SERVER_ERRORS:-0}"
echo "   Average Latency: ${LATENCY:-0} ms"

# Check Lambda integration
echo ""
echo "⚡ Checking Lambda integration..."
LAMBDA_CONFIG_FILE="lambda/config/lambda-config.json"

if [ -f "$LAMBDA_CONFIG_FILE" ]; then
    LAMBDA_FUNCTION_NAME=$(jq -r '.functionName' "$LAMBDA_CONFIG_FILE")
    
    # Check if Lambda function exists
    aws lambda get-function --function-name "$LAMBDA_FUNCTION_NAME" --region "$REGION" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ Lambda function: $LAMBDA_FUNCTION_NAME (accessible)"
    else
        echo "❌ Lambda function: $LAMBDA_FUNCTION_NAME (not accessible)"
    fi
else
    echo "⚠️  Lambda configuration not found"
fi

# Test API endpoint availability
echo ""
echo "🔍 Testing API endpoint availability..."
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS "$API_ENDPOINT" --max-time 10)

if [ "$HEALTH_CHECK" = "200" ]; then
    echo "✅ API endpoint is responding (OPTIONS: $HEALTH_CHECK)"
else
    echo "⚠️  API endpoint response: $HEALTH_CHECK"
fi

# Check recent logs (if available)
echo ""
echo "📋 Recent API Gateway execution logs:"
LOG_GROUP="/aws/apigateway/$API_NAME"

aws logs describe-log-groups --log-group-name-prefix "$LOG_GROUP" --region "$REGION" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    aws logs filter-log-events \
        --log-group-name "$LOG_GROUP" \
        --start-time $(( $(date +%s) * 1000 - 3600000 )) \
        --region "$REGION" \
        --query 'events[-5:].message' \
        --output text 2>/dev/null | head -5 || echo "   No recent logs found"
else
    echo "   No execution logs configured (this is normal for basic setup)"
fi

# Overall status assessment
echo ""
echo "🎯 Overall Status:"
if [ "${REQUESTS:-0}" -gt 0 ] && [ "${SERVER_ERRORS:-0}" -eq 0 ]; then
    echo "✅ API Gateway is fully operational"
    echo "🌐 Receiving and processing requests successfully"
    echo "⚡ Lambda integration is working"
    echo "🚀 Ready for frontend integration"
elif [ "${REQUESTS:-0}" -eq 0 ]; then
    echo "✅ API Gateway is configured and ready"
    echo "📊 No recent requests (this is normal for new APIs)"
    echo "🧪 Run 'api-gateway/scripts/test-api.sh' to test functionality"
else
    echo "⚠️  API Gateway has some issues"
    echo "🔧 Check error rates and Lambda function status"
fi

echo ""
echo "🛠️  Available commands:"
echo "   api-gateway/scripts/test-api.sh     - Test API with various scenarios"
echo "   api-gateway/scripts/update-api.sh   - Update API configuration"
echo "   api-gateway/scripts/destroy-api.sh  - Remove API Gateway"
echo "   api-gateway/scripts/setup-api.sh    - Recreate API Gateway"
echo ""
echo "🔧 API Endpoint for frontend integration:"
echo "$API_ENDPOINT"
