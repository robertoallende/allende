#!/bin/bash

# SNS Cleanup Script for Contact Form Notifications
# Destroys SNS topic and subscriptions

set -e

CONFIG_FILE="sns/config/sns-config.json"

echo "🗑️  SNS Cleanup Script"
echo ""

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ SNS configuration not found. Nothing to clean up."
    exit 0
fi

# Load configuration
TOPIC_ARN=$(jq -r '.topicArn' "$CONFIG_FILE")
SUBSCRIPTION_ARN=$(jq -r '.subscriptionArn' "$CONFIG_FILE")
REGION=$(jq -r '.region' "$CONFIG_FILE")
EMAIL_ENDPOINT=$(jq -r '.emailEndpoint' "$CONFIG_FILE")

echo "📧 Topic ARN: $TOPIC_ARN"
echo "📬 Subscription ARN: $SUBSCRIPTION_ARN"
echo "📍 Region: $REGION"
echo "📧 Email: $EMAIL_ENDPOINT"
echo ""

# Confirmation prompt
echo "⚠️  WARNING: This will delete the SNS topic and all subscriptions."
echo "   You will no longer receive email notifications from the contact form."
echo ""
echo "🤔 Are you sure you want to continue? (y/N)"
read -r CONFIRM

if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    echo "❌ Cleanup cancelled"
    exit 0
fi

echo ""
echo "🗑️  Starting cleanup..."

# Delete subscription first (if it exists and is not pending)
if [ "$SUBSCRIPTION_ARN" != "null" ] && [ "$SUBSCRIPTION_ARN" != "PendingConfirmation" ]; then
    echo "📭 Deleting email subscription..."
    aws sns unsubscribe \
        --subscription-arn "$SUBSCRIPTION_ARN" \
        --region "$REGION" || echo "⚠️  Subscription may already be deleted"
    
    echo "✅ Email subscription deleted"
fi

# Delete topic
echo "📧 Deleting SNS topic..."
aws sns delete-topic \
    --topic-arn "$TOPIC_ARN" \
    --region "$REGION"

if [ $? -eq 0 ]; then
    echo "✅ SNS topic deleted successfully"
else
    echo "❌ Failed to delete SNS topic"
    exit 1
fi

# Remove config file
echo "💾 Removing configuration file..."
rm -f "$CONFIG_FILE"
echo "✅ Configuration file removed"

# Remove empty directories
if [ -d "sns/config" ] && [ -z "$(ls -A sns/config)" ]; then
    rmdir sns/config
    echo "✅ Empty config directory removed"
fi

echo ""
echo "🎉 SNS cleanup complete!"
echo ""
echo "📋 What was removed:"
echo "- SNS topic: contact-form-notifications"
echo "- Email subscription for: $EMAIL_ENDPOINT"
echo "- Configuration file: $CONFIG_FILE"
echo ""
echo "💡 To recreate the SNS setup, run: sns/scripts/setup-sns.sh"
