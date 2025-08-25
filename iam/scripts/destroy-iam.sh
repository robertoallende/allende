#!/bin/bash

# IAM Cleanup Script for Contact Form Lambda Role
# Destroys IAM role and custom policy

set -e

CONFIG_FILE="iam/config/iam-config.json"

echo "🗑️  IAM Cleanup Script"
echo ""

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ IAM configuration not found. Nothing to clean up."
    exit 0
fi

# Load configuration
ROLE_ARN=$(jq -r '.roleArn' "$CONFIG_FILE")
POLICY_ARN=$(jq -r '.policyArn' "$CONFIG_FILE")
ROLE_NAME=$(jq -r '.roleName' "$CONFIG_FILE")
POLICY_NAME=$(jq -r '.policyName' "$CONFIG_FILE")

echo "👤 Role Name: $ROLE_NAME"
echo "👤 Role ARN: $ROLE_ARN"
echo "📋 Policy Name: $POLICY_NAME"
echo "📋 Policy ARN: $POLICY_ARN"
echo ""

# Confirmation prompt
echo "⚠️  WARNING: This will delete the IAM role and policy."
echo "   Lambda functions using this role will stop working."
echo "   This action cannot be undone."
echo ""
echo "🤔 Are you sure you want to continue? (y/N)"
read -r CONFIRM

if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    echo "❌ Cleanup cancelled"
    exit 0
fi

echo ""
echo "🗑️  Starting cleanup..."

# Detach policies from role first
echo "🔗 Detaching policies from role..."

# Detach AWS managed policy
aws iam detach-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" \
    2>/dev/null || echo "⚠️  Basic execution policy may already be detached"

echo "✅ AWS managed policy detached"

# Detach custom policy
aws iam detach-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-arn "$POLICY_ARN" \
    2>/dev/null || echo "⚠️  Custom policy may already be detached"

echo "✅ Custom policy detached"

# Delete the role
echo "👤 Deleting IAM role..."
aws iam delete-role --role-name "$ROLE_NAME"

if [ $? -eq 0 ]; then
    echo "✅ IAM role deleted successfully"
else
    echo "❌ Failed to delete IAM role"
    exit 1
fi

# Delete the custom policy
echo "📋 Deleting custom IAM policy..."
aws iam delete-policy --policy-arn "$POLICY_ARN"

if [ $? -eq 0 ]; then
    echo "✅ Custom IAM policy deleted successfully"
else
    echo "❌ Failed to delete custom IAM policy"
    exit 1
fi

# Remove config file
echo "💾 Removing configuration file..."
rm -f "$CONFIG_FILE"
echo "✅ Configuration file removed"

# Remove empty directories
if [ -d "iam/config" ] && [ -z "$(ls -A iam/config)" ]; then
    rmdir iam/config
    echo "✅ Empty config directory removed"
fi

echo ""
echo "🎉 IAM cleanup complete!"
echo ""
echo "📋 What was removed:"
echo "- IAM role: $ROLE_NAME"
echo "- IAM policy: $POLICY_NAME"
echo "- Configuration file: $CONFIG_FILE"
echo ""
echo "⚠️  Impact:"
echo "- Lambda functions using this role will no longer work"
echo "- SNS publish permissions have been revoked"
echo ""
echo "💡 To recreate the IAM setup, run: iam/scripts/setup-iam.sh"
