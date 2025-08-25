# API Gateway Infrastructure for Contact Form API

This directory contains AWS CLI scripts to manage the API Gateway infrastructure for the contact form system. It creates a secure, rate-limited HTTPS endpoint that connects the frontend conversational email flow to the backend Lambda function.

## Overview

The API Gateway serves as the HTTP bridge between the frontend and backend:

- **REST API**: `contact-form-api` with regional endpoint for better performance
- **Endpoint**: `/submit` (POST method) for contact form submissions
- **Security**: Rate limiting and CORS protection restricted to allende.ai
- **Integration**: Direct Lambda proxy integration with comprehensive error handling

## Architecture

### Request Flow
```
Frontend (allende.ai)
    ↓ HTTPS POST
API Gateway (/submit)
    ↓ CORS Check (allende.ai only)
    ↓ Rate Limiting (10 req/min)
    ↓ Lambda Proxy Integration
Lambda Function (contact-form-processor)
    ↓ Input Validation & Processing
    ↓ SNS Publish
Email Notification to Roberto
```

### Security Layers
1. **CORS Protection**: Only allows requests from https://allende.ai
2. **Rate Limiting**: 10 requests/minute, 20 burst, 100/day per IP
3. **Input Validation**: Lambda function validates all input data
4. **HTTPS Only**: All communication encrypted in transit

## Prerequisites

### Required Tools
- **AWS CLI**: `aws --version` (v2.0+ recommended)
- **jq**: `jq --version` (for JSON processing)
- **curl**: For API testing
- **bash**: Unix shell environment

### AWS Configuration
```bash
# Configure AWS CLI with your credentials
aws configure

# Verify configuration
aws sts get-caller-identity
```

### Dependencies
- **Unit 8.3**: Lambda function must exist (`lambda/config/lambda-config.json`)
- **Working Lambda**: Function must be deployed and operational

## Scripts

### 🚀 Deploy API Gateway
```bash
# Create API Gateway with Lambda integration
./api-gateway/scripts/setup-api.sh
```

**What it does:**
- Creates REST API with regional endpoint
- Sets up `/submit` resource with POST and OPTIONS methods
- Configures Lambda proxy integration
- Sets up CORS for https://allende.ai
- Configures rate limiting (10 req/min, 20 burst)
- Grants API Gateway permission to invoke Lambda
- Creates production deployment
- Optionally tests the endpoint

**Output:**
- API endpoint URL for frontend integration
- Configuration saved to `api-gateway/config/api-config.json`

### 📊 Check API Status
```bash
# Monitor API Gateway status and metrics
./api-gateway/scripts/status-api.sh
```

**What it shows:**
- API Gateway and stage configuration
- Resources and methods
- Recent metrics (requests, errors, latency)
- Lambda integration status
- Endpoint availability
- Rate limiting configuration

### 🧪 Test API Comprehensively
```bash
# Run comprehensive API tests
./api-gateway/scripts/test-api.sh
```

**What it tests:**
- Valid contact form submissions
- Input validation (missing fields, invalid email)
- CORS preflight requests (OPTIONS)
- Human verification requirements
- Invalid JSON handling
- Rate limiting behavior
- Realistic submission scenarios

### 🗑️ Cleanup API Gateway
```bash
# Remove API Gateway and resources
./api-gateway/scripts/destroy-api.sh
```

**What it removes:**
- API Gateway and all resources
- Lambda invoke permissions
- Configuration files
- Prompts for confirmation before deletion

## Configuration

### Generated Files
```
api-gateway/
├── config/
│   └── api-config.json     # API endpoint, configuration
├── scripts/
│   ├── setup-api.sh        # Deploy API Gateway
│   ├── status-api.sh       # Monitor status
│   ├── test-api.sh         # Test endpoint
│   └── destroy-api.sh      # Cleanup
└── docs/
    └── api-spec.json       # OpenAPI specification
```

### Configuration Format
```json
{
  "apiName": "contact-form-api",
  "apiId": "abc123def4",
  "stageName": "prod",
  "resourcePath": "submit",
  "httpMethod": "POST",
  "apiEndpoint": "https://abc123def4.execute-api.us-east-1.amazonaws.com/prod/submit",
  "lambdaFunctionArn": "arn:aws:lambda:us-east-1:123456789012:function:contact-form-processor",
  "corsOrigin": "https://allende.ai",
  "rateLimit": 10,
  "burstLimit": 20,
  "quotaLimit": 100,
  "region": "us-east-1",
  "createdAt": "2025-08-25T10:24:31Z"
}
```

## API Specification

### Endpoint
```
POST https://abc123def4.execute-api.us-east-1.amazonaws.com/prod/submit
```

### Request Format
```http
POST /prod/submit
Content-Type: application/json
Origin: https://allende.ai

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello Roberto! I love your AWS articles...",
  "verificationPassed": true,
  "timestamp": "2025-08-25T10:24:31.559Z"
}
```

### Success Response
```http
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: https://allende.ai
Access-Control-Allow-Methods: POST,OPTIONS
Access-Control-Allow-Headers: Content-Type

{
  "message": "Message sent successfully!",
  "requestId": "abc123-def456"
}
```

### Error Response
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
Access-Control-Allow-Origin: https://allende.ai

{
  "error": "Name is required"
}
```

### CORS Preflight
```http
OPTIONS /prod/submit
Origin: https://allende.ai
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type

HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://allende.ai
Access-Control-Allow-Methods: POST,OPTIONS
Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token
```

## Security Configuration

### CORS Protection
- **Allowed Origin**: `https://allende.ai` only
- **Allowed Methods**: POST, OPTIONS
- **Allowed Headers**: Content-Type and AWS headers
- **Browser Enforcement**: Browsers block unauthorized origins

### Rate Limiting
- **Rate Limit**: 10 requests per minute per IP address
- **Burst Limit**: 20 requests (allows temporary spikes)
- **Daily Quota**: 100 requests per day per IP address
- **Throttling Response**: HTTP 429 Too Many Requests

### Input Validation
- **API Gateway**: Basic JSON format validation
- **Lambda Function**: Comprehensive input validation
- **Error Handling**: Secure error messages without sensitive data

## Usage Workflow

### Initial Setup
1. **Complete Unit 8.3**: Ensure Lambda function is deployed
2. **Deploy API**: `./api-gateway/scripts/setup-api.sh`
3. **Test endpoint**: `./api-gateway/scripts/test-api.sh`
4. **Check status**: `./api-gateway/scripts/status-api.sh`

### Frontend Integration
1. **Get endpoint URL**: From `api-gateway/config/api-config.json`
2. **Update frontend**: Replace mock API calls with real endpoint
3. **Test CORS**: Ensure requests work from https://allende.ai
4. **Handle errors**: Process API error responses properly

### Monitoring
- **API status**: `./api-gateway/scripts/status-api.sh`
- **CloudWatch metrics**: AWS Console → API Gateway → Monitoring
- **Lambda logs**: Check Lambda function logs for processing details
- **Email delivery**: Verify SNS notifications reach Roberto

### Cleanup
- **Remove API**: `./api-gateway/scripts/destroy-api.sh`

## Integration with Other Units

### Unit 8.3: Lambda Function
- **Requires**: Function ARN from `lambda/config/lambda-config.json`
- **Integration**: Lambda proxy integration passes all request data
- **Permissions**: API Gateway granted permission to invoke Lambda
- **Response**: Lambda returns complete HTTP response with CORS headers

### Unit 8.5: Frontend Integration
- **Provides**: API endpoint URL for frontend HTTP requests
- **CORS**: Configured for https://allende.ai origin
- **Request Format**: JSON specification for frontend implementation
- **Error Handling**: Standardized error responses for frontend processing

### Amplify Integration
- **Environment Variables**: API_ENDPOINT for frontend build
- **Build Process**: Frontend uses real API instead of mock calls
- **Deployment**: Automatic deployment with API integration

## Error Handling

### Client Errors (4XX)
- **400 Bad Request**: Invalid input data (missing fields, invalid email)
- **429 Too Many Requests**: Rate limiting exceeded
- **403 Forbidden**: CORS violation (wrong origin)

### Server Errors (5XX)
- **500 Internal Server Error**: Lambda function errors
- **502 Bad Gateway**: Lambda function timeout or crash
- **503 Service Unavailable**: AWS service issues

### Error Response Format
```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "requestId": "abc123-def456"
}
```

## Performance and Monitoring

### CloudWatch Metrics
- **Count**: Total number of API requests
- **4XXError**: Client error count
- **5XXError**: Server error count
- **Latency**: Average response time
- **IntegrationLatency**: Lambda execution time

### Performance Targets
- **Response Time**: < 2 seconds for valid requests
- **Availability**: > 99.9% uptime
- **Error Rate**: < 1% for valid requests
- **Rate Limiting**: Effective protection against abuse

### Monitoring Commands
```bash
# Check recent metrics
./api-gateway/scripts/status-api.sh

# Test endpoint health
curl -X OPTIONS https://your-api-endpoint.com/prod/submit

# Monitor CloudWatch logs
aws logs filter-log-events --log-group-name /aws/apigateway/contact-form-api
```

## Cost Considerations

### API Gateway Pricing
- **REST API Requests**: $3.50 per million requests
- **Data Transfer**: $0.09 per GB out
- **Free Tier**: 1 million requests per month for 12 months

### Estimated Costs (Contact Form Usage)
- **100 submissions/month**: ~$0.0004 (essentially free)
- **1,000 submissions/month**: ~$0.004
- **10,000 submissions/month**: ~$0.04

### Cost Optimization
- **Regional Endpoint**: Lower cost than edge-optimized
- **Efficient Lambda**: Fast execution reduces integration latency
- **Rate Limiting**: Prevents abuse and unexpected costs

## Troubleshooting

### Common Issues

#### CORS Errors
```bash
# Check CORS configuration
./api-gateway/scripts/status-api.sh

# Test CORS preflight
curl -X OPTIONS https://your-endpoint.com/prod/submit \
  -H "Origin: https://allende.ai" \
  -H "Access-Control-Request-Method: POST"
```

#### Rate Limiting
```bash
# Check rate limit configuration
./api-gateway/scripts/status-api.sh

# Test rate limiting
./api-gateway/scripts/test-api.sh
```

#### Lambda Integration Errors
```bash
# Check Lambda function status
./lambda/scripts/status-lambda.sh

# Check API Gateway permissions
aws lambda get-policy --function-name contact-form-processor
```

#### API Not Responding
```bash
# Check API Gateway status
aws apigateway get-rest-api --rest-api-id YOUR_API_ID

# Check deployment
aws apigateway get-deployment --rest-api-id YOUR_API_ID --deployment-id YOUR_DEPLOYMENT_ID
```

### Success Indicators
- ✅ API endpoint URL generated and accessible
- ✅ CORS preflight requests return 200
- ✅ Valid POST requests return 200 with success message
- ✅ Invalid requests return 400 with error details
- ✅ Rate limiting returns 429 when exceeded
- ✅ Lambda function receives and processes requests
- ✅ Email notifications delivered successfully

## Next Steps

After API Gateway setup is complete:

1. **Unit 8.5**: Update frontend to use real API endpoint
2. **Testing**: End-to-end testing of complete email flow
3. **Monitoring**: Set up CloudWatch alarms for error rates
4. **Production**: Consider custom domain and enhanced security

The API endpoint from `api-gateway/config/api-config.json` will be used for frontend integration.

## Security Best Practices

### Production Considerations
- **Custom Domain**: Use api.allende.ai instead of AWS domain
- **API Keys**: Consider adding API key authentication
- **WAF Integration**: Add AWS WAF for advanced protection
- **Logging**: Enable detailed request/response logging

### Monitoring and Alerting
- **Error Rate Alerts**: Alert if 4XX/5XX errors > 5%
- **Latency Alerts**: Alert if average latency > 5 seconds
- **Rate Limiting**: Monitor throttling events
- **Lambda Errors**: Track Lambda function failures

### Compliance
- **Data Privacy**: No PII stored in API Gateway logs
- **Encryption**: All data encrypted in transit (HTTPS/TLS)
- **Audit Trail**: Complete request logging in CloudWatch
- **Access Control**: CORS restricts browser access to authorized domain
