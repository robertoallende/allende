#!/bin/bash

# Add SNS permissions to coderipple-deployment user
# Run this with admin AWS credentials

set -e

USER_NAME="coderipple-deployment"
POLICY_NAME="ContactFormSNSPolicy"
POLICY_FILE="sns/iam-policy.json"

echo "🔐 Adding SNS permissions to user: $USER_NAME"
echo ""

# Check if policy file exists
if [ ! -f "$POLICY_FILE" ]; then
    echo "❌ Policy file not found: $POLICY_FILE"
    exit 1
fi

# Create the policy
echo "📋 Creating IAM policy: $POLICY_NAME"
POLICY_ARN=$(aws iam create-policy \
    --policy-name "$POLICY_NAME" \
    --policy-document file://"$POLICY_FILE" \
    --description "Allows SNS operations for contact form notifications" \
    --query 'Policy.Arn' \
    --output text 2>/dev/null || echo "Policy may already exist")

if [ "$POLICY_ARN" = "Policy may already exist" ]; then
    # Get existing policy ARN
    POLICY_ARN=$(aws iam list-policies \
        --query "Policies[?PolicyName=='$POLICY_NAME'].Arn" \
        --output text)
    echo "✅ Using existing policy: $POLICY_ARN"
else
    echo "✅ Created new policy: $POLICY_ARN"
fi

# Attach policy to user
echo "🔗 Attaching policy to user: $USER_NAME"
aws iam attach-user-policy \
    --user-name "$USER_NAME" \
    --policy-arn "$POLICY_ARN"

if [ $? -eq 0 ]; then
    echo "✅ Policy attached successfully"
    echo ""
    echo "🎉 SNS permissions added!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Wait 1-2 minutes for permissions to propagate"
    echo "2. Run: ./sns/scripts/setup-sns.sh"
    echo ""
    echo "🔧 Policy ARN: $POLICY_ARN"
else
    echo "❌ Failed to attach policy"
    exit 1
fi
