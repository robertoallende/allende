#!/bin/bash

# SNS Status Check Script
# Checks the current status of SNS topic and subscriptions

set -e

CONFIG_FILE="sns/config/sns-config.json"

echo "📊 SNS Status Check"
echo ""

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ SNS not configured. Run 'sns/scripts/setup-sns.sh' to set up."
    exit 1
fi

# Load configuration
TOPIC_ARN=$(jq -r '.topicArn' "$CONFIG_FILE")
REGION=$(jq -r '.region' "$CONFIG_FILE")
EMAIL_ENDPOINT=$(jq -r '.emailEndpoint' "$CONFIG_FILE")
CREATED_AT=$(jq -r '.createdAt' "$CONFIG_FILE")

echo "📧 Topic ARN: $TOPIC_ARN"
echo "📍 Region: $REGION"
echo "📬 Email: $EMAIL_ENDPOINT"
echo "📅 Created: $CREATED_AT"
echo ""

# Check topic status
echo "🔍 Checking SNS topic status..."
TOPIC_ATTRS=$(aws sns get-topic-attributes \
    --topic-arn "$TOPIC_ARN" \
    --region "$REGION" \
    --output json 2>/dev/null)

if [ $? -eq 0 ]; then
    echo "✅ SNS topic is active"
    
    # Extract topic details
    DISPLAY_NAME=$(echo "$TOPIC_ATTRS" | jq -r '.Attributes.DisplayName // "N/A"')
    SUBSCRIPTIONS_CONFIRMED=$(echo "$TOPIC_ATTRS" | jq -r '.Attributes.SubscriptionsConfirmed // "0"')
    SUBSCRIPTIONS_PENDING=$(echo "$TOPIC_ATTRS" | jq -r '.Attributes.SubscriptionsPending // "0"')
    
    echo "   Display Name: $DISPLAY_NAME"
    echo "   Confirmed Subscriptions: $SUBSCRIPTIONS_CONFIRMED"
    echo "   Pending Subscriptions: $SUBSCRIPTIONS_PENDING"
else
    echo "❌ SNS topic not found or not accessible"
    exit 1
fi

# Check subscriptions
echo ""
echo "📬 Checking subscriptions..."
SUBSCRIPTIONS=$(aws sns list-subscriptions-by-topic \
    --topic-arn "$TOPIC_ARN" \
    --region "$REGION" \
    --output json)

if [ $? -eq 0 ]; then
    SUB_COUNT=$(echo "$SUBSCRIPTIONS" | jq '.Subscriptions | length')
    echo "📊 Found $SUB_COUNT subscription(s)"
    
    if [ "$SUB_COUNT" -gt 0 ]; then
        echo ""
        echo "📋 Subscription Details:"
        echo "$SUBSCRIPTIONS" | jq -r '.Subscriptions[] | "   Protocol: \(.Protocol), Endpoint: \(.Endpoint), Status: \(.SubscriptionArn)"' | sed 's/PendingConfirmation/⏳ Pending Confirmation/g' | sed 's/arn:aws:sns/✅ Confirmed/g'
    fi
else
    echo "❌ Failed to check subscriptions"
fi

# Overall status
echo ""
echo "🎯 Overall Status:"
if [ "$SUBSCRIPTIONS_CONFIRMED" -gt 0 ]; then
    echo "✅ SNS is fully configured and ready"
    echo "📧 Email notifications will be delivered to: $EMAIL_ENDPOINT"
    echo "🚀 Ready for Lambda integration (Unit 8.2)"
elif [ "$SUBSCRIPTIONS_PENDING" -gt 0 ]; then
    echo "⏳ SNS is configured but email subscription needs confirmation"
    echo "📧 Check your email ($EMAIL_ENDPOINT) and click 'Confirm subscription'"
    echo "🔄 Run this script again after confirming"
else
    echo "⚠️  SNS topic exists but no subscriptions found"
    echo "🔧 You may need to run 'sns/scripts/setup-sns.sh' again"
fi

echo ""
echo "🛠️  Available commands:"
echo "   sns/scripts/test-sns.sh     - Send test notification"
echo "   sns/scripts/destroy-sns.sh  - Remove SNS setup"
echo "   sns/scripts/setup-sns.sh    - Recreate SNS setup"
