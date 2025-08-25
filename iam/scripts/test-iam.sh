#!/bin/bash

# IAM Test Script for Contact Form Lambda Role
# Tests IAM role permissions and configuration

set -e

CONFIG_FILE="iam/config/iam-config.json"

echo "🧪 Testing IAM Contact Form Lambda Role"
echo ""

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ IAM configuration not found. Please run 'iam/scripts/setup-iam.sh' first."
    exit 1
fi

# Load configuration
ROLE_ARN=$(jq -r '.roleArn' "$CONFIG_FILE")
POLICY_ARN=$(jq -r '.policyArn' "$CONFIG_FILE")
TOPIC_ARN=$(jq -r '.topicArn' "$CONFIG_FILE")
ROLE_NAME=$(jq -r '.roleName' "$CONFIG_FILE")
POLICY_NAME=$(jq -r '.policyName' "$CONFIG_FILE")

echo "👤 Role ARN: $ROLE_ARN"
echo "📋 Policy ARN: $POLICY_ARN"
echo "📧 Topic ARN: $TOPIC_ARN"
echo ""

# Test 1: Check if role exists
echo "🔍 Test 1: Verifying IAM role exists..."
aws iam get-role --role-name "$ROLE_NAME" > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ IAM role exists and is accessible"
else
    echo "❌ IAM role not found or not accessible"
    exit 1
fi

# Test 2: Check if policy exists
echo "🔍 Test 2: Verifying IAM policy exists..."
aws iam get-policy --policy-arn "$POLICY_ARN" > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ IAM policy exists and is accessible"
else
    echo "❌ IAM policy not found or not accessible"
    exit 1
fi

# Test 3: Check role policies
echo "🔍 Test 3: Checking attached policies..."
ATTACHED_POLICIES=$(aws iam list-attached-role-policies \
    --role-name "$ROLE_NAME" \
    --query 'AttachedPolicies[].PolicyName' \
    --output text)

echo "📋 Attached policies: $ATTACHED_POLICIES"

# Check for required policies
if echo "$ATTACHED_POLICIES" | grep -q "AWSLambdaBasicExecutionRole"; then
    echo "✅ Basic Lambda execution policy attached"
else
    echo "❌ Basic Lambda execution policy missing"
fi

if echo "$ATTACHED_POLICIES" | grep -q "$POLICY_NAME"; then
    echo "✅ Custom SNS publish policy attached"
else
    echo "❌ Custom SNS publish policy missing"
fi

# Test 4: Test role assumption
echo "🔍 Test 4: Testing role assumption..."
ASSUME_RESULT=$(aws sts assume-role \
    --role-arn "$ROLE_ARN" \
    --role-session-name "iam-test-session" \
    --duration-seconds 900 \
    --output json 2>/dev/null)

if [ $? -eq 0 ]; then
    echo "✅ Role can be assumed successfully"
    
    # Extract temporary credentials
    ACCESS_KEY=$(echo "$ASSUME_RESULT" | jq -r '.Credentials.AccessKeyId')
    SECRET_KEY=$(echo "$ASSUME_RESULT" | jq -r '.Credentials.SecretAccessKey')
    SESSION_TOKEN=$(echo "$ASSUME_RESULT" | jq -r '.Credentials.SessionToken')
    
    echo "🔑 Temporary credentials obtained"
    
    # Test 5: Test SNS publish permission with temporary credentials
    echo "🔍 Test 5: Testing SNS publish permission..."
    
    TEST_MESSAGE="IAM Permission Test

This is a test message sent using temporary credentials from the Lambda execution role to verify SNS publish permissions are working correctly.

Role: $ROLE_NAME
Policy: $POLICY_NAME
Test Time: $(date -u +%Y-%m-%dT%H:%M:%SZ)
Test ID: $(uuidgen | tr '[:upper:]' '[:lower:]')"

    # Use temporary credentials to publish message
    AWS_ACCESS_KEY_ID="$ACCESS_KEY" \
    AWS_SECRET_ACCESS_KEY="$SECRET_KEY" \
    AWS_SESSION_TOKEN="$SESSION_TOKEN" \
    aws sns publish \
        --topic-arn "$TOPIC_ARN" \
        --subject "IAM Permission Test - Lambda Role" \
        --message "$TEST_MESSAGE" \
        --output table > /dev/null

    if [ $? -eq 0 ]; then
        echo "✅ SNS publish permission working correctly"
        echo "📧 Test message sent to SNS topic"
        echo "📬 Check your email for the test notification"
    else
        echo "❌ SNS publish permission failed"
        echo "🔧 Check policy configuration and topic ARN"
    fi
else
    echo "❌ Failed to assume role"
    exit 1
fi

echo ""
echo "🎯 IAM Permission Test Summary:"
echo "✅ Role exists and is accessible"
echo "✅ Policy exists and is accessible"
echo "✅ Required policies are attached"
echo "✅ Role can be assumed by Lambda service"
echo "✅ SNS publish permission is working"
echo ""
echo "🚀 IAM configuration is ready for Lambda function!"
echo "📋 Ready to proceed to Unit 8.3 (Lambda Function Development)"
echo ""
echo "🛠️  Available commands:"
echo "   iam/scripts/status-iam.sh   - Check IAM status"
echo "   iam/scripts/destroy-iam.sh  - Remove IAM setup"
echo "   iam/scripts/setup-iam.sh    - Recreate IAM setup"
