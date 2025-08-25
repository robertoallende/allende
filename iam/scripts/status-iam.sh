#!/bin/bash

# IAM Status Check Script
# Checks the current status of IAM role and policies

set -e

CONFIG_FILE="iam/config/iam-config.json"

echo "📊 IAM Status Check"
echo ""

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ IAM not configured. Run 'iam/scripts/setup-iam.sh' to set up."
    exit 1
fi

# Load configuration
ROLE_ARN=$(jq -r '.roleArn' "$CONFIG_FILE")
POLICY_ARN=$(jq -r '.policyArn' "$CONFIG_FILE")
TOPIC_ARN=$(jq -r '.topicArn' "$CONFIG_FILE")
ROLE_NAME=$(jq -r '.roleName' "$CONFIG_FILE")
POLICY_NAME=$(jq -r '.policyName' "$CONFIG_FILE")
CREATED_AT=$(jq -r '.createdAt' "$CONFIG_FILE")

echo "👤 Role Name: $ROLE_NAME"
echo "👤 Role ARN: $ROLE_ARN"
echo "📋 Policy Name: $POLICY_NAME"
echo "📋 Policy ARN: $POLICY_ARN"
echo "📧 Target Topic: $TOPIC_ARN"
echo "📅 Created: $CREATED_AT"
echo ""

# Check role status
echo "🔍 Checking IAM role status..."
ROLE_INFO=$(aws iam get-role --role-name "$ROLE_NAME" --output json 2>/dev/null)

if [ $? -eq 0 ]; then
    echo "✅ IAM role is active"
    
    # Extract role details
    CREATE_DATE=$(echo "$ROLE_INFO" | jq -r '.Role.CreateDate')
    DESCRIPTION=$(echo "$ROLE_INFO" | jq -r '.Role.Description // "N/A"')
    
    echo "   Created: $CREATE_DATE"
    echo "   Description: $DESCRIPTION"
else
    echo "❌ IAM role not found or not accessible"
    exit 1
fi

# Check policy status
echo ""
echo "🔍 Checking IAM policy status..."
POLICY_INFO=$(aws iam get-policy --policy-arn "$POLICY_ARN" --output json 2>/dev/null)

if [ $? -eq 0 ]; then
    echo "✅ IAM policy is active"
    
    # Extract policy details
    POLICY_CREATE_DATE=$(echo "$POLICY_INFO" | jq -r '.Policy.CreateDate')
    POLICY_DESCRIPTION=$(echo "$POLICY_INFO" | jq -r '.Policy.Description // "N/A"')
    
    echo "   Created: $POLICY_CREATE_DATE"
    echo "   Description: $POLICY_DESCRIPTION"
else
    echo "❌ IAM policy not found or not accessible"
    exit 1
fi

# Check attached policies
echo ""
echo "🔗 Checking attached policies..."
ATTACHED_POLICIES=$(aws iam list-attached-role-policies \
    --role-name "$ROLE_NAME" \
    --output json)

if [ $? -eq 0 ]; then
    POLICY_COUNT=$(echo "$ATTACHED_POLICIES" | jq '.AttachedPolicies | length')
    echo "📊 Found $POLICY_COUNT attached policy(ies)"
    
    if [ "$POLICY_COUNT" -gt 0 ]; then
        echo ""
        echo "📋 Attached Policy Details:"
        echo "$ATTACHED_POLICIES" | jq -r '.AttachedPolicies[] | "   • \(.PolicyName) (\(.PolicyArn))"'
        
        # Check for required policies
        echo ""
        echo "🔍 Required Policy Check:"
        if echo "$ATTACHED_POLICIES" | jq -e '.AttachedPolicies[] | select(.PolicyName == "AWSLambdaBasicExecutionRole")' > /dev/null; then
            echo "   ✅ AWSLambdaBasicExecutionRole (CloudWatch logs)"
        else
            echo "   ❌ AWSLambdaBasicExecutionRole missing"
        fi
        
        if echo "$ATTACHED_POLICIES" | jq -e ".AttachedPolicies[] | select(.PolicyName == \"$POLICY_NAME\")" > /dev/null; then
            echo "   ✅ $POLICY_NAME (SNS publish)"
        else
            echo "   ❌ $POLICY_NAME missing"
        fi
    fi
else
    echo "❌ Failed to check attached policies"
fi

# Check SNS topic accessibility
echo ""
echo "📧 Checking SNS topic accessibility..."
aws sns get-topic-attributes --topic-arn "$TOPIC_ARN" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ SNS topic is accessible"
else
    echo "❌ SNS topic not accessible or doesn't exist"
fi

# Overall status
echo ""
echo "🎯 Overall Status:"
if [ "$POLICY_COUNT" -ge 2 ]; then
    echo "✅ IAM is fully configured and ready"
    echo "🚀 Lambda function can use role: $ROLE_NAME"
    echo "📧 SNS publishing will work to: $TOPIC_ARN"
    echo "🔧 Ready for Unit 8.3 (Lambda Function Development)"
else
    echo "⚠️  IAM role exists but policies may be missing"
    echo "🔧 You may need to run 'iam/scripts/setup-iam.sh' again"
fi

echo ""
echo "🛠️  Available commands:"
echo "   iam/scripts/test-iam.sh     - Test IAM permissions"
echo "   iam/scripts/destroy-iam.sh  - Remove IAM setup"
echo "   iam/scripts/setup-iam.sh    - Recreate IAM setup"
