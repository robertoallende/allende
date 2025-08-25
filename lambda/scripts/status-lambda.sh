#!/bin/bash

# Lambda Status Check Script
# Checks the current status of Lambda function

set -e

CONFIG_FILE="lambda/config/lambda-config.json"

echo "📊 Lambda Function Status Check"
echo ""

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ Lambda not configured. Run 'lambda/scripts/setup-lambda.sh' to set up."
    exit 1
fi

# Load configuration
FUNCTION_NAME=$(jq -r '.functionName' "$CONFIG_FILE")
FUNCTION_ARN=$(jq -r '.functionArn' "$CONFIG_FILE")
RUNTIME=$(jq -r '.runtime' "$CONFIG_FILE")
HANDLER=$(jq -r '.handler' "$CONFIG_FILE")
ROLE_ARN=$(jq -r '.roleArn' "$CONFIG_FILE")
TOPIC_ARN=$(jq -r '.topicArn' "$CONFIG_FILE")
REGION=$(jq -r '.region' "$CONFIG_FILE")
CREATED_AT=$(jq -r '.createdAt' "$CONFIG_FILE")

echo "⚡ Function Name: $FUNCTION_NAME"
echo "⚡ Function ARN: $FUNCTION_ARN"
echo "🐍 Runtime: $RUNTIME"
echo "🎯 Handler: $HANDLER"
echo "👤 Role: $(basename "$ROLE_ARN")"
echo "📧 SNS Topic: $(basename "$TOPIC_ARN")"
echo "📍 Region: $REGION"
echo "📅 Created: $CREATED_AT"
echo ""

# Check function status
echo "🔍 Checking Lambda function status..."
FUNCTION_INFO=$(aws lambda get-function --function-name "$FUNCTION_NAME" --region "$REGION" --output json 2>/dev/null)

if [ $? -eq 0 ]; then
    echo "✅ Lambda function is active"
    
    # Extract function details
    STATE=$(echo "$FUNCTION_INFO" | jq -r '.Configuration.State')
    LAST_MODIFIED=$(echo "$FUNCTION_INFO" | jq -r '.Configuration.LastModified')
    CODE_SIZE=$(echo "$FUNCTION_INFO" | jq -r '.Configuration.CodeSize')
    TIMEOUT=$(echo "$FUNCTION_INFO" | jq -r '.Configuration.Timeout')
    MEMORY_SIZE=$(echo "$FUNCTION_INFO" | jq -r '.Configuration.MemorySize')
    
    echo "   State: $STATE"
    echo "   Last Modified: $LAST_MODIFIED"
    echo "   Code Size: $CODE_SIZE bytes"
    echo "   Timeout: $TIMEOUT seconds"
    echo "   Memory: $MEMORY_SIZE MB"
else
    echo "❌ Lambda function not found or not accessible"
    exit 1
fi

# Check environment variables
echo ""
echo "🔧 Environment Variables:"
ENV_VARS=$(echo "$FUNCTION_INFO" | jq -r '.Configuration.Environment.Variables // {}')
if [ "$ENV_VARS" != "{}" ]; then
    echo "$ENV_VARS" | jq -r 'to_entries[] | "   \(.key): \(.value)"'
else
    echo "   No environment variables set"
fi

# Check function configuration
echo ""
echo "⚙️  Function Configuration:"
echo "   Runtime: $(echo "$FUNCTION_INFO" | jq -r '.Configuration.Runtime')"
echo "   Handler: $(echo "$FUNCTION_INFO" | jq -r '.Configuration.Handler')"
echo "   Role: $(echo "$FUNCTION_INFO" | jq -r '.Configuration.Role' | sed 's/.*\///')"
echo "   Timeout: $(echo "$FUNCTION_INFO" | jq -r '.Configuration.Timeout')s"
echo "   Memory: $(echo "$FUNCTION_INFO" | jq -r '.Configuration.MemorySize')MB"

# Check recent invocations
echo ""
echo "📈 Recent Invocation Metrics (last 24 hours):"
END_TIME=$(date -u +%Y-%m-%dT%H:%M:%S)
START_TIME=$(date -u -d '24 hours ago' +%Y-%m-%dT%H:%M:%S)

# Get invocation count
INVOCATIONS=$(aws cloudwatch get-metric-statistics \
    --namespace AWS/Lambda \
    --metric-name Invocations \
    --dimensions Name=FunctionName,Value="$FUNCTION_NAME" \
    --start-time "$START_TIME" \
    --end-time "$END_TIME" \
    --period 86400 \
    --statistics Sum \
    --region "$REGION" \
    --query 'Datapoints[0].Sum' \
    --output text 2>/dev/null || echo "0")

# Get error count
ERRORS=$(aws cloudwatch get-metric-statistics \
    --namespace AWS/Lambda \
    --metric-name Errors \
    --dimensions Name=FunctionName,Value="$FUNCTION_NAME" \
    --start-time "$START_TIME" \
    --end-time "$END_TIME" \
    --period 86400 \
    --statistics Sum \
    --region "$REGION" \
    --query 'Datapoints[0].Sum' \
    --output text 2>/dev/null || echo "0")

# Get duration
DURATION=$(aws cloudwatch get-metric-statistics \
    --namespace AWS/Lambda \
    --metric-name Duration \
    --dimensions Name=FunctionName,Value="$FUNCTION_NAME" \
    --start-time "$START_TIME" \
    --end-time "$END_TIME" \
    --period 86400 \
    --statistics Average \
    --region "$REGION" \
    --query 'Datapoints[0].Average' \
    --output text 2>/dev/null || echo "0")

echo "   Invocations: ${INVOCATIONS:-0}"
echo "   Errors: ${ERRORS:-0}"
echo "   Avg Duration: ${DURATION:-0} ms"

# Check recent logs
echo ""
echo "📋 Recent Logs (last 10 entries):"
aws logs filter-log-events \
    --log-group-name "/aws/lambda/$FUNCTION_NAME" \
    --start-time $(( $(date +%s) * 1000 - 3600000 )) \
    --region "$REGION" \
    --query 'events[-10:].message' \
    --output text 2>/dev/null | head -10 || echo "   No recent logs found"

# Check dependencies
echo ""
echo "🔗 Dependency Status:"

# Check IAM role
aws iam get-role --role-name "$(basename "$ROLE_ARN")" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ IAM Role: $(basename "$ROLE_ARN")"
else
    echo "   ❌ IAM Role: $(basename "$ROLE_ARN") - Not accessible"
fi

# Check SNS topic
aws sns get-topic-attributes --topic-arn "$TOPIC_ARN" --region "$REGION" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ SNS Topic: $(basename "$TOPIC_ARN")"
else
    echo "   ❌ SNS Topic: $(basename "$TOPIC_ARN") - Not accessible"
fi

# Overall status
echo ""
echo "🎯 Overall Status:"
if [ "$STATE" = "Active" ] && [ "${ERRORS:-0}" = "0" ]; then
    echo "✅ Lambda function is fully operational"
    echo "⚡ Ready to process contact form submissions"
    echo "🚀 Ready for API Gateway integration (Unit 8.4)"
elif [ "$STATE" = "Active" ] && [ "${ERRORS:-0}" != "0" ]; then
    echo "⚠️  Lambda function is active but has recent errors"
    echo "🔧 Check logs and test function with 'lambda/scripts/test-lambda.sh'"
else
    echo "⚠️  Lambda function may have issues"
    echo "🔧 Check configuration and dependencies"
fi

echo ""
echo "🛠️  Available commands:"
echo "   lambda/scripts/test-lambda.sh     - Test function with various scenarios"
echo "   lambda/scripts/update-lambda.sh   - Update function code"
echo "   lambda/scripts/destroy-lambda.sh  - Remove function"
echo "   lambda/scripts/setup-lambda.sh    - Recreate function"
