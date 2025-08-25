#!/bin/bash

# IAM Setup Script for Contact Form Lambda Function
# Unit 8.2: IAM Roles and Security Configuration

set -e  # Exit on any error

# Configuration
POLICY_NAME="ContactFormSNSPublish"
ROLE_NAME="contact-form-lambda-role"
REGION="${AWS_REGION:-us-east-1}"
SNS_CONFIG_FILE="sns/config/sns-config.json"

echo "🔐 Setting up IAM for Contact Form Lambda Function"
echo "Policy: $POLICY_NAME"
echo "Role: $ROLE_NAME"
echo "Region: $REGION"
echo ""

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS CLI configured"

# Get current account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "📋 Account ID: $ACCOUNT_ID"

# Check if SNS topic exists and get ARN
if [ ! -f "$SNS_CONFIG_FILE" ]; then
    echo "❌ SNS configuration not found. Please run 'sns/scripts/setup-sns.sh' first."
    exit 1
fi

TOPIC_ARN=$(jq -r '.topicArn' "$SNS_CONFIG_FILE")
if [ "$TOPIC_ARN" = "null" ] || [ -z "$TOPIC_ARN" ]; then
    echo "❌ SNS Topic ARN not found in configuration."
    exit 1
fi

echo "📧 SNS Topic ARN: $TOPIC_ARN"
echo ""

# Create custom SNS publish policy
echo "📋 Creating IAM policy: $POLICY_NAME"

# Generate policy document with actual Topic ARN
POLICY_DOCUMENT=$(cat << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "SNSPublishToContactFormTopic",
      "Effect": "Allow",
      "Action": [
        "sns:Publish"
      ],
      "Resource": "$TOPIC_ARN"
    }
  ]
}
EOF
)

# Create the policy
POLICY_ARN=$(aws iam create-policy \
    --policy-name "$POLICY_NAME" \
    --policy-document "$POLICY_DOCUMENT" \
    --description "Allows Lambda function to publish messages to contact form SNS topic" \
    --query 'Policy.Arn' \
    --output text 2>/dev/null || echo "POLICY_EXISTS")

if [ "$POLICY_ARN" = "POLICY_EXISTS" ]; then
    # Get existing policy ARN
    POLICY_ARN=$(aws iam list-policies \
        --query "Policies[?PolicyName=='$POLICY_NAME'].Arn" \
        --output text)
    echo "✅ Using existing policy: $POLICY_ARN"
else
    echo "✅ Created new policy: $POLICY_ARN"
fi

# Create Lambda execution role trust policy
echo "👤 Creating IAM role: $ROLE_NAME"

TRUST_POLICY=$(cat << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
)

# Create the role
ROLE_ARN=$(aws iam create-role \
    --role-name "$ROLE_NAME" \
    --assume-role-policy-document "$TRUST_POLICY" \
    --description "Execution role for contact form Lambda function with SNS publish permissions" \
    --query 'Role.Arn' \
    --output text 2>/dev/null || echo "ROLE_EXISTS")

if [ "$ROLE_ARN" = "ROLE_EXISTS" ]; then
    # Get existing role ARN
    ROLE_ARN=$(aws iam get-role \
        --role-name "$ROLE_NAME" \
        --query 'Role.Arn' \
        --output text)
    echo "✅ Using existing role: $ROLE_ARN"
else
    echo "✅ Created new role: $ROLE_ARN"
fi

# Attach AWS managed policy for basic Lambda execution
echo "🔗 Attaching basic Lambda execution policy..."
aws iam attach-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" || echo "Policy already attached"

echo "✅ Basic Lambda execution policy attached"

# Attach custom SNS publish policy
echo "🔗 Attaching custom SNS publish policy..."
aws iam attach-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-arn "$POLICY_ARN" || echo "Policy already attached"

echo "✅ Custom SNS publish policy attached"

# Wait for role to be available (AWS eventual consistency)
echo "⏳ Waiting for IAM role to be available..."
sleep 10

# Save configuration for other scripts
CONFIG_FILE="iam/config/iam-config.json"
mkdir -p "$(dirname "$CONFIG_FILE")"

cat > "$CONFIG_FILE" << EOF
{
  "policyName": "$POLICY_NAME",
  "policyArn": "$POLICY_ARN",
  "roleName": "$ROLE_NAME",
  "roleArn": "$ROLE_ARN",
  "topicArn": "$TOPIC_ARN",
  "accountId": "$ACCOUNT_ID",
  "region": "$REGION",
  "createdAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo "💾 Configuration saved to: $CONFIG_FILE"
echo ""

# Test role permissions
echo "🧪 Would you like to test the IAM role permissions? (y/n)"
read -r TEST_PERMISSIONS

if [ "$TEST_PERMISSIONS" = "y" ] || [ "$TEST_PERMISSIONS" = "Y" ]; then
    echo "🔍 Testing IAM role permissions..."
    
    # Simulate what Lambda would do - check if role can be assumed
    aws sts assume-role \
        --role-arn "$ROLE_ARN" \
        --role-session-name "test-session" \
        --duration-seconds 900 > /dev/null

    if [ $? -eq 0 ]; then
        echo "✅ Role can be assumed successfully"
        echo "✅ IAM configuration is working correctly"
    else
        echo "❌ Failed to assume role - there may be an issue"
    fi
fi

echo ""
echo "🎉 IAM setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Run 'iam/scripts/test-iam.sh' to validate permissions"
echo "2. Proceed to Unit 8.3 (Lambda Function Development)"
echo ""
echo "📝 Important files created:"
echo "- $CONFIG_FILE (contains Role ARN for Lambda function)"
echo ""
echo "🔧 Role ARN for Lambda function:"
echo "$ROLE_ARN"
echo ""
echo "🔐 Security Summary:"
echo "- Policy: $POLICY_NAME (SNS publish to contact form topic only)"
echo "- Role: $ROLE_NAME (Lambda execution + SNS publish)"
echo "- Principle: Least privilege access"
