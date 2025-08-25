#!/bin/bash

# SNS Setup Script for Contact Form Notifications
# Unit 8.1: AWS SNS Email Notification Setup

set -e  # Exit on any error

# Configuration
TOPIC_NAME="contact-form-notifications"
DISPLAY_NAME="Contact Form Notifications"
EMAIL_ENDPOINT="${ROBERTO_EMAIL:-roberto@example.com}"  # Set via environment variable
REGION="${AWS_REGION:-us-east-1}"

echo "🚀 Setting up SNS for Contact Form Notifications"
echo "Region: $REGION"
echo "Topic: $TOPIC_NAME"
echo "Email: $EMAIL_ENDPOINT"
echo ""

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS CLI configured"

# Create SNS Topic
echo "📧 Creating SNS topic..."
TOPIC_ARN=$(aws sns create-topic \
    --name "$TOPIC_NAME" \
    --region "$REGION" \
    --attributes DisplayName="$DISPLAY_NAME" \
    --query 'TopicArn' \
    --output text)

if [ $? -eq 0 ]; then
    echo "✅ SNS topic created successfully"
    echo "Topic ARN: $TOPIC_ARN"
else
    echo "❌ Failed to create SNS topic"
    exit 1
fi

# Subscribe email to topic
echo "📬 Creating email subscription..."
SUBSCRIPTION_ARN=$(aws sns subscribe \
    --topic-arn "$TOPIC_ARN" \
    --protocol email \
    --notification-endpoint "$EMAIL_ENDPOINT" \
    --region "$REGION" \
    --query 'SubscriptionArn' \
    --output text)

if [ $? -eq 0 ]; then
    echo "✅ Email subscription created"
    echo "Subscription ARN: $SUBSCRIPTION_ARN"
    echo ""
    echo "📧 IMPORTANT: Check your email ($EMAIL_ENDPOINT) for a confirmation message"
    echo "   Click 'Confirm subscription' in the email to activate notifications"
else
    echo "❌ Failed to create email subscription"
    exit 1
fi

# Save configuration for other scripts
CONFIG_FILE="sns/config/sns-config.json"
mkdir -p "$(dirname "$CONFIG_FILE")"

cat > "$CONFIG_FILE" << EOF
{
  "topicName": "$TOPIC_NAME",
  "topicArn": "$TOPIC_ARN",
  "subscriptionArn": "$SUBSCRIPTION_ARN",
  "emailEndpoint": "$EMAIL_ENDPOINT",
  "region": "$REGION",
  "createdAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo "💾 Configuration saved to: $CONFIG_FILE"
echo ""

# Test message
echo "🧪 Would you like to send a test message? (y/n)"
read -r SEND_TEST

if [ "$SEND_TEST" = "y" ] || [ "$SEND_TEST" = "Y" ]; then
    echo "📤 Sending test message..."
    
    TEST_MESSAGE="Contact Form Submission

Name: Test User
Email: test@example.com

Message:
This is a test message to verify the SNS notification system is working correctly.

Submitted: $(date -u +%Y-%m-%dT%H:%M:%SZ)
Verification: Passed
Source: AWS CLI Setup Script"

    aws sns publish \
        --topic-arn "$TOPIC_ARN" \
        --subject "Test Contact Form Notification" \
        --message "$TEST_MESSAGE" \
        --region "$REGION" > /dev/null

    if [ $? -eq 0 ]; then
        echo "✅ Test message sent successfully"
        echo "📧 Check your email for the test notification"
    else
        echo "❌ Failed to send test message"
    fi
fi

echo ""
echo "🎉 SNS setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Check your email and confirm the subscription"
echo "2. Run 'sns/scripts/test-sns.sh' to verify notifications work"
echo "3. Proceed to Unit 8.2 (IAM Roles and Security Configuration)"
echo ""
echo "📝 Important files created:"
echo "- $CONFIG_FILE (contains Topic ARN for Lambda integration)"
echo ""
echo "🔧 Topic ARN for Lambda function:"
echo "$TOPIC_ARN"
