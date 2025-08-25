# Lambda Function for Contact Form Processing

This directory contains the AWS Lambda function and infrastructure scripts for processing contact form submissions from the conversational email flow. The function validates input, formats notifications, and sends them via SNS.

## Overview

The Lambda function serves as the backend processor for the contact form system:

- **Function Name**: `contact-form-processor`
- **Runtime**: Python 3.13
- **Purpose**: Process conversational email submissions and send notifications
- **Integration**: Uses IAM role from Unit 8.2, publishes to SNS from Unit 8.1

## Architecture

### Data Flow
```
Frontend (Conversational Email Flow)
    ↓ HTTP POST
API Gateway (Unit 8.4)
    ↓ Invoke
Lambda Function (Unit 8.3)
    ↓ Validate & Format
SNS Topic (Unit 8.1)
    ↓ Email Notification
Roberto's Email
```

### Function Logic
1. **Parse Request**: Extract name, email, message from request body
2. **Validate Input**: Check required fields, email format, verification status
3. **Format Message**: Create professional notification for Roberto
4. **Send Notification**: Publish to SNS topic for email delivery
5. **Return Response**: Success/error response to frontend

## Prerequisites

### Required Tools
- **AWS CLI**: `aws --version` (v2.0+ recommended)
- **Python**: `python3 --version` (3.8+ for development)
- **pip**: For installing dependencies
- **jq**: `jq --version` (for JSON processing)
- **zip**: For creating deployment packages

### AWS Configuration
```bash
# Configure AWS CLI with your credentials
aws configure

# Verify configuration
aws sts get-caller-identity
```

### Dependencies
- **Unit 8.1**: SNS topic must exist (`sns/config/sns-config.json`)
- **Unit 8.2**: IAM role must exist (`iam/config/iam-config.json`)

## Function Code

### Main Handler
```python
# lambda/src/lambda_function.py
def lambda_handler(event, context):
    # Parse and validate input
    # Format notification message
    # Send via SNS
    # Return response
```

### Key Features
- **Comprehensive Input Validation**: Name, email, message, verification status
- **Professional Message Formatting**: Structured notifications for Roberto
- **Error Handling**: Graceful failure with proper HTTP status codes
- **Logging**: Comprehensive CloudWatch logging for debugging
- **CORS Support**: Proper headers for frontend integration

### Environment Variables
- **SNS_TOPIC_ARN**: Target SNS topic for notifications
- **LOG_LEVEL**: Logging level (INFO, DEBUG, ERROR)

## Scripts

### 🚀 Deploy Lambda Function
```bash
# Create and deploy Lambda function
./lambda/scripts/setup-lambda.sh
```

**What it does:**
- Creates deployment package from source code
- Installs Python dependencies
- Creates or updates Lambda function
- Configures environment variables
- Sets up IAM role and permissions
- Optionally tests function after deployment

**Output:**
- Function ARN (needed for API Gateway)
- Configuration saved to `lambda/config/lambda-config.json`

### 📊 Check Function Status
```bash
# Check current Lambda function status
./lambda/scripts/status-lambda.sh
```

**What it shows:**
- Function configuration and state
- Environment variables
- Recent invocation metrics
- Error counts and duration
- Recent CloudWatch logs
- Dependency status (IAM role, SNS topic)

### 🧪 Test Function Comprehensively
```bash
# Run comprehensive function tests
./lambda/scripts/test-lambda.sh
```

**What it tests:**
- Valid contact form submission
- Missing required fields
- Invalid email format
- Unverified submissions
- Invalid JSON format
- Realistic complete submissions
- Recent function logs

### 🔄 Update Function Code
```bash
# Update function code without recreating
./lambda/scripts/update-lambda.sh
```

**What it does:**
- Creates new deployment package
- Updates function code only
- Preserves configuration and permissions
- Optionally tests updated function
- Updates configuration timestamp

### 🗑️ Cleanup Function
```bash
# Remove Lambda function and resources
./lambda/scripts/destroy-lambda.sh
```

**What it removes:**
- Lambda function
- CloudWatch log group
- Configuration files
- Prompts for confirmation before deletion

## Configuration

### Generated Files
```
lambda/
├── config/
│   └── lambda-config.json  # Function ARN, configuration
├── src/
│   ├── lambda_function.py  # Main function code
│   └── requirements.txt    # Python dependencies
└── scripts/
    ├── setup-lambda.sh     # Deploy function
    ├── status-lambda.sh    # Check status
    ├── test-lambda.sh      # Test function
    ├── update-lambda.sh    # Update code
    └── destroy-lambda.sh   # Cleanup
```

### Configuration Format
```json
{
  "functionName": "contact-form-processor",
  "functionArn": "arn:aws:lambda:us-east-1:123456789012:function:contact-form-processor",
  "runtime": "python3.13",
  "handler": "lambda_function.lambda_handler",
  "roleArn": "arn:aws:iam::123456789012:role/contact-form-lambda-role",
  "topicArn": "arn:aws:sns:us-east-1:123456789012:contact-form-notifications",
  "region": "us-east-1",
  "timeout": 30,
  "memorySize": 128,
  "createdAt": "2025-08-25T08:47:33Z"
}
```

## Input/Output Specification

### Expected Input
```json
{
  "body": "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"message\":\"Hello Roberto! I love your AWS articles...\",\"verificationPassed\":true,\"timestamp\":\"2025-08-25T08:47:33.494Z\"}"
}
```

### Success Response
```json
{
  "statusCode": 200,
  "headers": {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST"
  },
  "body": "{\"message\":\"Message sent successfully!\",\"requestId\":\"abc123-def456\"}"
}
```

### Error Response
```json
{
  "statusCode": 400,
  "headers": {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST"
  },
  "body": "{\"error\":\"Name is required\"}"
}
```

### SNS Notification Format
```
Subject: Contact Form: John Doe

Contact Form Submission

Name: John Doe
Email: john@example.com

Message:
Hello Roberto! I love your AWS articles and would like to collaborate on a project.

Submitted: 2025-08-25T08:47:33.494Z
Verification: Passed
Source: Conversational Email Flow
Request ID: abc123-def456

---
This message was sent through the conversational email system on your website.
Reply directly to john@example.com to respond to John Doe.
```

## Usage Workflow

### Initial Setup
1. **Complete dependencies**: Ensure Units 8.1 and 8.2 are complete
2. **Deploy function**: `./lambda/scripts/setup-lambda.sh`
3. **Test function**: `./lambda/scripts/test-lambda.sh`
4. **Check status**: `./lambda/scripts/status-lambda.sh`

### Development Workflow
1. **Edit code**: Modify `lambda/src/lambda_function.py`
2. **Update function**: `./lambda/scripts/update-lambda.sh`
3. **Test changes**: `./lambda/scripts/test-lambda.sh`
4. **Check logs**: `./lambda/scripts/status-lambda.sh`

### Monitoring
- **Function status**: `./lambda/scripts/status-lambda.sh`
- **CloudWatch logs**: AWS Console → CloudWatch → Log Groups
- **Metrics**: AWS Console → Lambda → Functions → Monitoring

### Cleanup
- **Remove function**: `./lambda/scripts/destroy-lambda.sh`

## Integration with Other Units

### Unit 8.1: SNS Topic
- **Requires**: Topic ARN from `sns/config/sns-config.json`
- **Usage**: Function publishes notifications to SNS topic
- **Dependency**: SNS topic must exist and be accessible

### Unit 8.2: IAM Role
- **Requires**: Role ARN from `iam/config/iam-config.json`
- **Usage**: Function assumes role for execution permissions
- **Permissions**: Role allows CloudWatch logs and SNS publish

### Unit 8.4: API Gateway
- **Provides**: Function ARN from `lambda/config/lambda-config.json`
- **Integration**: API Gateway will invoke this function
- **Protocol**: HTTP POST with JSON body

### Unit 8.5: Frontend Integration
- **Endpoint**: API Gateway endpoint (from Unit 8.4)
- **Protocol**: HTTPS POST with CORS headers
- **Data**: JSON payload with name, email, message, verification

## Error Handling

### Input Validation Errors (400)
- Missing required fields (name, email, message)
- Invalid email format
- Human verification not passed
- Invalid JSON format
- Field length limits exceeded

### Server Errors (500)
- SNS publish failures
- Missing environment variables
- Unexpected exceptions
- AWS service errors

### Logging Strategy
- **INFO**: Successful processing, request details
- **WARNING**: Validation failures, recoverable errors
- **ERROR**: SNS failures, configuration issues, exceptions
- **DEBUG**: Detailed execution flow (when LOG_LEVEL=DEBUG)

## Security Considerations

### Input Sanitization
- All input fields are validated and trimmed
- Email format validation prevents injection
- Message length limits prevent abuse
- Verification status checked

### AWS Security
- **IAM Role**: Least privilege access (logs + SNS publish only)
- **Environment Variables**: Secure configuration storage
- **CloudWatch Logs**: Audit trail of all executions
- **Request IDs**: Unique tracking for each request

### CORS Configuration
- Currently set to `*` for development
- Should be configured to specific domain in production
- Proper headers for preflight requests

## Performance Optimization

### Function Configuration
- **Memory**: 128MB (sufficient for contact form processing)
- **Timeout**: 30 seconds (generous for SNS publish)
- **Runtime**: Python 3.13 (latest stable version)

### Cold Start Optimization
- Minimal dependencies (only boto3)
- Simple single-file structure
- Efficient initialization

### Cost Optimization
- **Pay per request**: No idle costs
- **Minimal memory**: 128MB keeps costs low
- **Fast execution**: Typically completes in <1 second

## Troubleshooting

### Common Issues

#### Function Not Found
```bash
# Check if function exists
aws lambda get-function --function-name contact-form-processor
```

#### Permission Denied
```bash
# Check IAM role and policies
./iam/scripts/status-iam.sh
```

#### SNS Publish Failures
```bash
# Check SNS topic and permissions
./sns/scripts/status-sns.sh
```

#### Invalid Input Errors
```bash
# Test with various input scenarios
./lambda/scripts/test-lambda.sh
```

### Success Indicators
- ✅ Function ARN generated and saved
- ✅ Test invocations return 200 status
- ✅ SNS notifications delivered to email
- ✅ CloudWatch logs show successful execution
- ✅ No errors in recent metrics

## Next Steps

After Lambda setup is complete:

1. **Unit 8.4**: Set up API Gateway to invoke Lambda function
2. **Unit 8.5**: Connect frontend to API Gateway endpoint
3. **Testing**: End-to-end testing of complete email flow

The Function ARN from `lambda/config/lambda-config.json` will be needed for API Gateway configuration.

## Cost Considerations

### AWS Lambda Pricing
- **Requests**: $0.20 per 1M requests
- **Duration**: $0.0000166667 per GB-second
- **Free Tier**: 1M requests and 400,000 GB-seconds per month

### Estimated Costs (Contact Form Usage)
- **100 submissions/month**: ~$0.00002 (essentially free)
- **1,000 submissions/month**: ~$0.0002
- **10,000 submissions/month**: ~$0.002

### Cost Optimization
- **Minimal memory allocation**: 128MB keeps duration costs low
- **Efficient code**: Fast execution reduces duration charges
- **No idle costs**: Pay only when function executes

## Monitoring and Observability

### CloudWatch Metrics
- **Invocations**: Number of function executions
- **Duration**: Execution time per invocation
- **Errors**: Failed executions
- **Throttles**: Rate limiting events

### CloudWatch Logs
- **Request details**: Name, email (sanitized), request ID
- **Validation results**: Success/failure with reasons
- **SNS publish status**: Success/failure with message ID
- **Error details**: Stack traces for debugging

### Alerting (Optional)
- **Error rate**: Alert if error rate > 5%
- **Duration**: Alert if average duration > 10 seconds
- **Throttling**: Alert on any throttling events

## Compliance and Governance

### Data Handling
- **PII Processing**: Name and email are processed but not stored
- **Data Transit**: All data encrypted in transit (HTTPS/TLS)
- **Logging**: No sensitive data logged (emails are sanitized)
- **Retention**: CloudWatch logs retained per AWS default (indefinite)

### Security Compliance
- **Least Privilege**: Function has minimal required permissions
- **Audit Trail**: All executions logged in CloudWatch
- **Input Validation**: Comprehensive validation prevents injection
- **Error Handling**: No sensitive data in error responses
