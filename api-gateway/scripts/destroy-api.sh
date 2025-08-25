#!/bin/bash

# API Gateway Cleanup Script for Contact Form API
# Destroys API Gateway and associated resources

set -e

CONFIG_FILE="api-gateway/config/api-config.json"

echo "🗑️  API Gateway Cleanup Script"
echo ""

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ API Gateway configuration not found. Nothing to clean up."
    exit 0
fi

# Load configuration
API_NAME=$(jq -r '.apiName' "$CONFIG_FILE")
API_ID=$(jq -r '.apiId' "$CONFIG_FILE")
STAGE_NAME=$(jq -r '.stageName' "$CONFIG_FILE")
API_ENDPOINT=$(jq -r '.apiEndpoint' "$CONFIG_FILE")
REGION=$(jq -r '.region' "$CONFIG_FILE")

echo "🌐 API Name: $API_NAME"
echo "🆔 API ID: $API_ID"
echo "🚀 Stage: $STAGE_NAME"
echo "🔗 Endpoint: $API_ENDPOINT"
echo "📍 Region: $REGION"
echo ""

# Confirmation prompt
echo "⚠️  WARNING: This will delete the API Gateway and all its resources."
echo "   The API endpoint will stop working immediately."
echo "   Frontend applications using this API will fail."
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

# Check if API exists
aws apigateway get-rest-api --rest-api-id "$API_ID" --region "$REGION" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "⚠️  API Gateway not found, may already be deleted"
else
    # Remove Lambda permissions first (if they exist)
    echo "🔐 Removing Lambda invoke permissions..."
    
    # Get Lambda function name from config
    LAMBDA_CONFIG_FILE="lambda/config/lambda-config.json"
    if [ -f "$LAMBDA_CONFIG_FILE" ]; then
        LAMBDA_FUNCTION_NAME=$(jq -r '.functionName' "$LAMBDA_CONFIG_FILE")
        
        # Try to remove permission (may not exist)
        aws lambda remove-permission \
            --function-name "$LAMBDA_FUNCTION_NAME" \
            --statement-id "apigateway-invoke-lambda-*" \
            --region "$REGION" 2>/dev/null || echo "   Permission may not exist or already removed"
        
        echo "✅ Lambda permissions cleanup attempted"
    else
        echo "   No Lambda configuration found"
    fi
    
    # Delete the API Gateway
    echo "🌐 Deleting API Gateway..."
    aws apigateway delete-rest-api --rest-api-id "$API_ID" --region "$REGION"
    
    if [ $? -eq 0 ]; then
        echo "✅ API Gateway deleted successfully"
    else
        echo "❌ Failed to delete API Gateway"
        exit 1
    fi
fi

# Remove config file
echo "💾 Removing configuration file..."
rm -f "$CONFIG_FILE"
echo "✅ Configuration file removed"

# Remove empty directories
if [ -d "api-gateway/config" ] && [ -z "$(ls -A api-gateway/config)" ]; then
    rmdir api-gateway/config
    echo "✅ Empty config directory removed"
fi

echo ""
echo "🎉 API Gateway cleanup complete!"
echo ""
echo "📋 What was removed:"
echo "- API Gateway: $API_NAME (ID: $API_ID)"
echo "- API endpoint: $API_ENDPOINT"
echo "- Stage: $STAGE_NAME"
echo "- Lambda invoke permissions"
echo "- Configuration file: $CONFIG_FILE"
echo ""
echo "⚠️  Impact:"
echo "- API endpoint is no longer accessible"
echo "- Frontend applications will receive connection errors"
echo "- Contact form submissions will fail"
echo ""
echo "💡 To recreate the API Gateway, run: api-gateway/scripts/setup-api.sh"
echo ""
echo "🔗 Dependencies still available:"
echo "- Lambda function: contact-form-processor (from Unit 8.3)"
echo "- IAM role: contact-form-lambda-role (from Unit 8.2)"
echo "- SNS topic: contact-form-notifications (from Unit 8.1)"
