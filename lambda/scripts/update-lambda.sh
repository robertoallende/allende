#!/bin/bash

# Lambda Update Script for Contact Form Processor
# Updates Lambda function code without recreating the function

set -e

CONFIG_FILE="lambda/config/lambda-config.json"

echo "🔄 Updating Lambda Function Code"
echo ""

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ Lambda configuration not found. Please run 'lambda/scripts/setup-lambda.sh' first."
    exit 1
fi

# Load configuration
FUNCTION_NAME=$(jq -r '.functionName' "$CONFIG_FILE")
REGION=$(jq -r '.region' "$CONFIG_FILE")

echo "⚡ Function Name: $FUNCTION_NAME"
echo "📍 Region: $REGION"
echo ""

# Check if function exists
aws lambda get-function --function-name "$FUNCTION_NAME" --region "$REGION" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Lambda function not found. Please run 'lambda/scripts/setup-lambda.sh' first."
    exit 1
fi

# Create deployment package
echo "📦 Creating updated deployment package..."
cd lambda/src

# Create temporary directory for package
TEMP_DIR=$(mktemp -d)
echo "📁 Using temporary directory: $TEMP_DIR"

# Copy function code
cp lambda_function.py "$TEMP_DIR/"

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "📥 Installing Python dependencies..."
    pip install -r requirements.txt -t "$TEMP_DIR/" --quiet
    
    if [ $? -eq 0 ]; then
        echo "✅ Dependencies installed"
    else
        echo "❌ Failed to install dependencies"
        rm -rf "$TEMP_DIR"
        exit 1
    fi
else
    echo "ℹ️  No requirements.txt found, using built-in modules only"
fi

# Create ZIP package
cd "$TEMP_DIR"
ZIP_FILE="contact-form-processor-update.zip"
zip -r "$ZIP_FILE" . > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ Updated deployment package created: $ZIP_FILE"
else
    echo "❌ Failed to create deployment package"
    rm -rf "$TEMP_DIR"
    exit 1
fi

# Move back to project root
cd - > /dev/null
cd ../..

# Update function code
echo "🔄 Updating Lambda function code..."
aws lambda update-function-code \
    --function-name "$FUNCTION_NAME" \
    --zip-file "fileb://$TEMP_DIR/$ZIP_FILE" \
    --region "$REGION" > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ Lambda function code updated successfully"
else
    echo "❌ Failed to update Lambda function code"
    rm -rf "$TEMP_DIR"
    exit 1
fi

# Cleanup temporary files
rm -rf "$TEMP_DIR"
echo "🧹 Cleaned up temporary files"

# Wait for function to be active
echo "⏳ Waiting for function to be active..."
aws lambda wait function-updated --function-name "$FUNCTION_NAME" --region "$REGION"

if [ $? -eq 0 ]; then
    echo "✅ Lambda function is active and ready"
else
    echo "⚠️  Function may still be updating"
fi

# Update configuration timestamp
UPDATED_CONFIG=$(jq --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" '.updatedAt = $timestamp' "$CONFIG_FILE")
echo "$UPDATED_CONFIG" > "$CONFIG_FILE"

echo "💾 Configuration updated with timestamp"
echo ""

# Test updated function
echo "🧪 Would you like to test the updated function? (y/n)"
read -r TEST_FUNCTION

if [ "$TEST_FUNCTION" = "y" ] || [ "$TEST_FUNCTION" = "Y" ]; then
    echo "🔍 Testing updated Lambda function..."
    
    # Create test payload
    TEST_PAYLOAD='{
        "body": "{\"name\":\"Update Test User\",\"email\":\"update-test@example.com\",\"message\":\"This is a test message after updating the Lambda function code to verify everything is working correctly.\",\"verificationPassed\":true,\"timestamp\":\"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'\"}"
    }'
    
    # Invoke function
    aws lambda invoke \
        --function-name "$FUNCTION_NAME" \
        --payload "$TEST_PAYLOAD" \
        --region "$REGION" \
        response.json > /dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Updated Lambda function invoked successfully"
        echo "📄 Response:"
        cat response.json | jq .
        rm -f response.json
        echo ""
        echo "📧 Check your email for the test notification!"
    else
        echo "❌ Failed to invoke updated Lambda function"
    fi
fi

echo ""
echo "🎉 Lambda function update complete!"
echo ""
echo "📋 What was updated:"
echo "- Function code from lambda/src/lambda_function.py"
echo "- Dependencies from lambda/src/requirements.txt (if present)"
echo "- Configuration timestamp"
echo ""
echo "🛠️  Available commands:"
echo "   lambda/scripts/test-lambda.sh     - Run comprehensive tests"
echo "   lambda/scripts/status-lambda.sh   - Check function status"
echo "   lambda/scripts/update-lambda.sh   - Update code again"
