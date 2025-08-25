#!/bin/bash

# SNS Test Script for Contact Form Notifications
# Tests the SNS notification system

set -e

CONFIG_FILE="sns/config/sns-config.json"

echo "🧪 Testing SNS Contact Form Notifications"
echo ""

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ SNS configuration not found. Please run 'sns/scripts/setup-sns.sh' first."
    exit 1
fi

# Load configuration
TOPIC_ARN=$(jq -r '.topicArn' "$CONFIG_FILE")
REGION=$(jq -r '.region' "$CONFIG_FILE")
EMAIL_ENDPOINT=$(jq -r '.emailEndpoint' "$CONFIG_FILE")

echo "📧 Topic ARN: $TOPIC_ARN"
echo "📍 Region: $REGION"
echo "📬 Email: $EMAIL_ENDPOINT"
echo ""

# Check if topic exists
echo "🔍 Verifying SNS topic exists..."
aws sns get-topic-attributes \
    --topic-arn "$TOPIC_ARN" \
    --region "$REGION" > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ SNS topic verified"
else
    echo "❌ SNS topic not found or not accessible"
    exit 1
fi

# Send test message
echo "📤 Sending test notification..."

TEST_MESSAGE="Contact Form Submission - Test

Name: Test User (CLI Test)
Email: test-cli@example.com

Message:
This is a test message sent via AWS CLI to verify the SNS notification system is working correctly for the conversational email flow.

Submitted: $(date -u +%Y-%m-%dT%H:%M:%SZ)
Verification: Passed
Source: CLI Test Script
Test ID: $(uuidgen | tr '[:upper:]' '[:lower:]')"

aws sns publish \
    --topic-arn "$TOPIC_ARN" \
    --subject "Test Contact Form Notification - CLI" \
    --message "$TEST_MESSAGE" \
    --region "$REGION" \
    --output table

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Test message sent successfully!"
    echo "📧 Check your email ($EMAIL_ENDPOINT) for the test notification"
    echo "⏱️  Email should arrive within 30 seconds"
    echo ""
    echo "🎯 If you received the email, SNS is working correctly!"
    echo "📋 Ready to proceed to Unit 8.2 (IAM Roles and Security)"
else
    echo "❌ Failed to send test message"
    exit 1
fi
