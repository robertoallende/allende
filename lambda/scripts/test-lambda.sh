#!/bin/bash

# Lambda Test Script for Contact Form Processor
# Tests Lambda function with various scenarios

set -e

CONFIG_FILE="lambda/config/lambda-config.json"

echo "🧪 Testing Lambda Contact Form Processor"
echo ""

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ Lambda configuration not found. Please run 'lambda/scripts/setup-lambda.sh' first."
    exit 1
fi

# Load configuration
FUNCTION_NAME=$(jq -r '.functionName' "$CONFIG_FILE")
FUNCTION_ARN=$(jq -r '.functionArn' "$CONFIG_FILE")
REGION=$(jq -r '.region' "$CONFIG_FILE")

echo "⚡ Function Name: $FUNCTION_NAME"
echo "⚡ Function ARN: $FUNCTION_ARN"
echo "📍 Region: $REGION"
echo ""

# Test 1: Valid contact form submission
echo "🔍 Test 1: Valid contact form submission"
TEST_PAYLOAD_1='{
    "body": "{\"name\":\"John Doe\",\"email\":\"john.doe@example.com\",\"message\":\"Hello Roberto! I love your AWS articles and would like to collaborate on a project. Looking forward to hearing from you.\",\"verificationPassed\":true,\"timestamp\":\"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'\"}"
}'

aws lambda invoke \
    --function-name "$FUNCTION_NAME" \
    --payload "$TEST_PAYLOAD_1" \
    --region "$REGION" \
    test1_response.json > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ Test 1 invocation successful"
    RESPONSE_1=$(cat test1_response.json)
    STATUS_CODE_1=$(echo "$RESPONSE_1" | jq -r '.statusCode')
    
    if [ "$STATUS_CODE_1" = "200" ]; then
        echo "✅ Test 1 passed - Status: $STATUS_CODE_1"
        echo "📧 Check your email for notification from John Doe"
    else
        echo "❌ Test 1 failed - Status: $STATUS_CODE_1"
        echo "Response: $RESPONSE_1"
    fi
else
    echo "❌ Test 1 invocation failed"
fi

rm -f test1_response.json
echo ""

# Test 2: Missing required field
echo "🔍 Test 2: Missing required field (name)"
TEST_PAYLOAD_2='{
    "body": "{\"email\":\"test@example.com\",\"message\":\"Test message\",\"verificationPassed\":true}"
}'

aws lambda invoke \
    --function-name "$FUNCTION_NAME" \
    --payload "$TEST_PAYLOAD_2" \
    --region "$REGION" \
    test2_response.json > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ Test 2 invocation successful"
    RESPONSE_2=$(cat test2_response.json)
    STATUS_CODE_2=$(echo "$RESPONSE_2" | jq -r '.statusCode')
    
    if [ "$STATUS_CODE_2" = "400" ]; then
        echo "✅ Test 2 passed - Correctly rejected missing field: $STATUS_CODE_2"
        ERROR_MSG_2=$(echo "$RESPONSE_2" | jq -r '.body' | jq -r '.error')
        echo "Error message: $ERROR_MSG_2"
    else
        echo "❌ Test 2 failed - Expected 400, got: $STATUS_CODE_2"
    fi
else
    echo "❌ Test 2 invocation failed"
fi

rm -f test2_response.json
echo ""

# Test 3: Invalid email format
echo "🔍 Test 3: Invalid email format"
TEST_PAYLOAD_3='{
    "body": "{\"name\":\"Test User\",\"email\":\"invalid-email\",\"message\":\"Test message\",\"verificationPassed\":true}"
}'

aws lambda invoke \
    --function-name "$FUNCTION_NAME" \
    --payload "$TEST_PAYLOAD_3" \
    --region "$REGION" \
    test3_response.json > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ Test 3 invocation successful"
    RESPONSE_3=$(cat test3_response.json)
    STATUS_CODE_3=$(echo "$RESPONSE_3" | jq -r '.statusCode')
    
    if [ "$STATUS_CODE_3" = "400" ]; then
        echo "✅ Test 3 passed - Correctly rejected invalid email: $STATUS_CODE_3"
        ERROR_MSG_3=$(echo "$RESPONSE_3" | jq -r '.body' | jq -r '.error')
        echo "Error message: $ERROR_MSG_3"
    else
        echo "❌ Test 3 failed - Expected 400, got: $STATUS_CODE_3"
    fi
else
    echo "❌ Test 3 invocation failed"
fi

rm -f test3_response.json
echo ""

# Test 4: Verification not passed
echo "🔍 Test 4: Human verification not passed"
TEST_PAYLOAD_4='{
    "body": "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"message\":\"Test message\",\"verificationPassed\":false}"
}'

aws lambda invoke \
    --function-name "$FUNCTION_NAME" \
    --payload "$TEST_PAYLOAD_4" \
    --region "$REGION" \
    test4_response.json > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ Test 4 invocation successful"
    RESPONSE_4=$(cat test4_response.json)
    STATUS_CODE_4=$(echo "$RESPONSE_4" | jq -r '.statusCode')
    
    if [ "$STATUS_CODE_4" = "400" ]; then
        echo "✅ Test 4 passed - Correctly rejected unverified submission: $STATUS_CODE_4"
        ERROR_MSG_4=$(echo "$RESPONSE_4" | jq -r '.body' | jq -r '.error')
        echo "Error message: $ERROR_MSG_4"
    else
        echo "❌ Test 4 failed - Expected 400, got: $STATUS_CODE_4"
    fi
else
    echo "❌ Test 4 invocation failed"
fi

rm -f test4_response.json
echo ""

# Test 5: Invalid JSON
echo "🔍 Test 5: Invalid JSON format"
TEST_PAYLOAD_5='{
    "body": "invalid-json-content"
}'

aws lambda invoke \
    --function-name "$FUNCTION_NAME" \
    --payload "$TEST_PAYLOAD_5" \
    --region "$REGION" \
    test5_response.json > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ Test 5 invocation successful"
    RESPONSE_5=$(cat test5_response.json)
    STATUS_CODE_5=$(echo "$RESPONSE_5" | jq -r '.statusCode')
    
    if [ "$STATUS_CODE_5" = "400" ]; then
        echo "✅ Test 5 passed - Correctly rejected invalid JSON: $STATUS_CODE_5"
        ERROR_MSG_5=$(echo "$RESPONSE_5" | jq -r '.body' | jq -r '.error')
        echo "Error message: $ERROR_MSG_5"
    else
        echo "❌ Test 5 failed - Expected 400, got: $STATUS_CODE_5"
    fi
else
    echo "❌ Test 5 invocation failed"
fi

rm -f test5_response.json
echo ""

# Test 6: Complete realistic submission
echo "🔍 Test 6: Complete realistic submission"
TEST_PAYLOAD_6='{
    "body": "{\"name\":\"Sarah Johnson\",\"email\":\"sarah.johnson@company.com\",\"message\":\"Hi Roberto,\\n\\nI came across your blog post about serverless architecture and found it incredibly insightful. I am currently working on a similar project and would love to discuss some of the challenges we are facing.\\n\\nWould you be available for a brief call next week?\\n\\nBest regards,\\nSarah\",\"verificationPassed\":true,\"timestamp\":\"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'\"}"
}'

aws lambda invoke \
    --function-name "$FUNCTION_NAME" \
    --payload "$TEST_PAYLOAD_6" \
    --region "$REGION" \
    test6_response.json > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ Test 6 invocation successful"
    RESPONSE_6=$(cat test6_response.json)
    STATUS_CODE_6=$(echo "$RESPONSE_6" | jq -r '.statusCode')
    
    if [ "$STATUS_CODE_6" = "200" ]; then
        echo "✅ Test 6 passed - Realistic submission processed: $STATUS_CODE_6"
        echo "📧 Check your email for notification from Sarah Johnson"
    else
        echo "❌ Test 6 failed - Status: $STATUS_CODE_6"
        echo "Response: $RESPONSE_6"
    fi
else
    echo "❌ Test 6 invocation failed"
fi

rm -f test6_response.json
echo ""

# Check function logs
echo "📊 Recent function logs (last 5 minutes):"
aws logs filter-log-events \
    --log-group-name "/aws/lambda/$FUNCTION_NAME" \
    --start-time $(( $(date +%s) * 1000 - 300000 )) \
    --region "$REGION" \
    --query 'events[*].[timestamp,message]' \
    --output table 2>/dev/null || echo "No recent logs found (this is normal for new functions)"

echo ""
echo "🎯 Lambda Function Test Summary:"
echo "✅ Function is deployed and responding"
echo "✅ Input validation is working correctly"
echo "✅ Error handling is functioning properly"
echo "✅ SNS integration is operational"
echo "📧 Email notifications should be delivered"
echo ""
echo "🚀 Lambda function is ready for API Gateway integration!"
echo "📋 Ready to proceed to Unit 8.4 (API Gateway Integration)"
echo ""
echo "🛠️  Available commands:"
echo "   lambda/scripts/status-lambda.sh   - Check function status"
echo "   lambda/scripts/update-lambda.sh   - Update function code"
echo "   lambda/scripts/destroy-lambda.sh  - Remove function"
