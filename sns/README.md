# SNS Infrastructure for Contact Form Notifications

This directory contains AWS CLI scripts to manage the SNS (Simple Notification Service) infrastructure for the conversational email flow system.

## Overview

The SNS system handles email notifications when users submit contact forms through the chat interface. It implements a publish-subscribe pattern where:

- **Topic**: `contact-form-notifications` receives messages from Lambda functions
- **Subscription**: Roberto's email receives formatted notifications
- **Security**: IAM roles control access (configured in Unit 8.2)

## Prerequisites

### Required Tools
- **AWS CLI**: `aws --version` (v2.0+ recommended)
- **jq**: `jq --version` (for JSON processing)
- **bash**: Unix shell environment

### AWS Configuration
```bash
# Configure AWS CLI with your credentials
aws configure

# Verify configuration
aws sts get-caller-identity
```

### Environment Variables
```bash
# Set Roberto's email address
export ROBERTO_EMAIL="roberto@example.com"

# Optional: Set AWS region (defaults to us-east-1)
export AWS_REGION="us-east-1"
```

## Scripts

### 🚀 Setup SNS Infrastructure
```bash
# Create SNS topic and email subscription
./sns/scripts/setup-sns.sh
```

**What it does:**
- Creates SNS topic: `contact-form-notifications`
- Subscribes Roberto's email for notifications
- Saves configuration to `sns/config/sns-config.json`
- Optionally sends test message

**Output:**
- Topic ARN (needed for Lambda integration)
- Subscription confirmation email sent

### 📊 Check SNS Status
```bash
# Check current SNS configuration and status
./sns/scripts/status-sns.sh
```

**What it shows:**
- Topic status and details
- Subscription status (confirmed/pending)
- Overall system readiness
- Available commands

### 🧪 Test Notifications
```bash
# Send test email notification
./sns/scripts/test-sns.sh
```

**What it does:**
- Sends formatted test message to SNS topic
- Verifies email delivery
- Confirms system is working end-to-end

### 🗑️ Cleanup Infrastructure
```bash
# Remove SNS topic and subscriptions
./sns/scripts/destroy-sns.sh
```

**What it removes:**
- SNS topic and all subscriptions
- Configuration files
- Prompts for confirmation before deletion

## Configuration

### Generated Files
```
sns/
├── config/
│   └── sns-config.json     # Topic ARN, subscription details
└── scripts/
    ├── setup-sns.sh        # Create infrastructure
    ├── status-sns.sh       # Check status
    ├── test-sns.sh         # Send test message
    └── destroy-sns.sh      # Cleanup
```

### Configuration Format
```json
{
  "topicName": "contact-form-notifications",
  "topicArn": "arn:aws:sns:us-east-1:123456789012:contact-form-notifications",
  "subscriptionArn": "arn:aws:sns:us-east-1:123456789012:contact-form-notifications:uuid",
  "emailEndpoint": "roberto@example.com",
  "region": "us-east-1",
  "createdAt": "2025-08-25T07:45:07Z"
}
```

## Usage Workflow

### Initial Setup
1. **Configure AWS CLI** and set environment variables
2. **Run setup script**: `./sns/scripts/setup-sns.sh`
3. **Check email** and confirm subscription
4. **Verify status**: `./sns/scripts/status-sns.sh`
5. **Test notifications**: `./sns/scripts/test-sns.sh`

### Daily Operations
- **Check status**: `./sns/scripts/status-sns.sh`
- **Send test**: `./sns/scripts/test-sns.sh`
- **Monitor**: AWS Console → SNS → Topics

### Cleanup
- **Remove everything**: `./sns/scripts/destroy-sns.sh`

## Integration with Other Units

### Unit 8.2: IAM Roles
- **Topic ARN** from `sns-config.json` used in IAM policies
- **Permissions** configured for Lambda to publish messages

### Unit 8.3: Lambda Function
- **Topic ARN** used in Lambda environment variables
- **SNS client** publishes formatted contact form messages

### Unit 8.5: Frontend Integration
- **End-to-end testing** verifies complete email flow
- **Error handling** for SNS publish failures

## Security Considerations

### AWS CLI Security
- **Uses existing AWS credentials** (same as console)
- **No additional security risks** compared to manual setup
- **Follows AWS best practices** for resource creation

### Access Control
- **Topic access** controlled by IAM policies (Unit 8.2)
- **Email subscriptions** require confirmation
- **Least privilege** principle applied

### Monitoring
- **CloudWatch logs** for SNS delivery status
- **AWS Console** for subscription management
- **Email delivery** confirmation via test messages

## Troubleshooting

### Common Issues

#### AWS CLI Not Configured
```bash
# Error: Unable to locate credentials
aws configure
```

#### Email Not Received
- Check spam folder
- Verify email address in subscription
- Confirm subscription via email link
- Test with `./sns/scripts/test-sns.sh`

#### Permission Denied
```bash
# Check AWS credentials and permissions
aws sts get-caller-identity
```

#### Topic Already Exists
- Use `./sns/scripts/status-sns.sh` to check existing setup
- Or cleanup with `./sns/scripts/destroy-sns.sh` and recreate

### Success Indicators
- ✅ Topic ARN generated and saved
- ✅ Email subscription confirmed
- ✅ Test message received
- ✅ Status shows "fully configured"

## Next Steps

After SNS setup is complete:

1. **Unit 8.2**: Create IAM roles using the Topic ARN
2. **Unit 8.3**: Develop Lambda function with SNS integration
3. **Unit 8.4**: Set up API Gateway
4. **Unit 8.5**: Connect frontend to backend

The Topic ARN from `sns/config/sns-config.json` will be needed for all subsequent units.
