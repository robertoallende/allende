#!/bin/bash

# Lambda Cleanup Script for Contact Form Processor
# Destroys Lambda function and associated resources

set -e

CONFIG_FILE="lambda/config/lambda-config.json"

echo "🗑️  Lambda Cleanup Script"
echo ""

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ Lambda configuration not found. Nothing to clean up."
    exit 0
fi

# Load configuration
FUNCTION_NAME=$(jq -r '.functionName' "$CONFIG_FILE")
FUNCTION_ARN=$(jq -r '.functionArn' "$CONFIG_FILE")
REGION=$(jq -r '.region' "$CONFIG_FILE")

echo "⚡ Function Name: $FUNCTION_NAME"
echo "⚡ Function ARN: $FUNCTION_ARN"
echo "📍 Region: $REGION"
echo ""

# Confirmation prompt
echo "⚠️  WARNING: This will delete the Lambda function."
echo "   API Gateway integrations using this function will stop working."
echo "   Contact form submissions will fail until function is recreated."
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

# Check if function exists
aws lambda get-function --function-name "$FUNCTION_NAME" --region "$REGION" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "⚠️  Lambda function not found, may already be deleted"
else
    # Delete the function
    echo "⚡ Deleting Lambda function..."
    aws lambda delete-function --function-name "$FUNCTION_NAME" --region "$REGION"
    
    if [ $? -eq 0 ]; then
        echo "✅ Lambda function deleted successfully"
    else
        echo "❌ Failed to delete Lambda function"
        exit 1
    fi
fi

# Delete CloudWatch log group
echo "📋 Deleting CloudWatch log group..."
aws logs delete-log-group --log-group-name "/aws/lambda/$FUNCTION_NAME" --region "$REGION" 2>/dev/null || echo "⚠️  Log group may not exist or already deleted"

if [ $? -eq 0 ]; then
    echo "✅ CloudWatch log group deleted"
else
    echo "ℹ️  CloudWatch log group cleanup completed"
fi

# Remove config file
echo "💾 Removing configuration file..."
rm -f "$CONFIG_FILE"
echo "✅ Configuration file removed"

# Remove empty directories
if [ -d "lambda/config" ] && [ -z "$(ls -A lambda/config)" ]; then
    rmdir lambda/config
    echo "✅ Empty config directory removed"
fi

echo ""
echo "🎉 Lambda cleanup complete!"
echo ""
echo "📋 What was removed:"
echo "- Lambda function: $FUNCTION_NAME"
echo "- CloudWatch log group: /aws/lambda/$FUNCTION_NAME"
echo "- Configuration file: $CONFIG_FILE"
echo ""
echo "⚠️  Impact:"
echo "- Contact form submissions will no longer work"
echo "- API Gateway integrations will return errors"
echo "- Email notifications will stop"
echo ""
echo "💡 To recreate the Lambda function, run: lambda/scripts/setup-lambda.sh"
echo ""
echo "🔗 Dependencies still available:"
echo "- IAM role: contact-form-lambda-role (from Unit 8.2)"
echo "- SNS topic: contact-form-notifications (from Unit 8.1)"
echo "- Function code: lambda/src/lambda_function.py"
