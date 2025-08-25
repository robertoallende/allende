# IAM Infrastructure for Contact Form Lambda Function

This directory contains AWS CLI scripts to manage the IAM (Identity and Access Management) infrastructure for the contact form Lambda function. It creates secure, least-privilege permissions for Lambda to publish messages to SNS.

## Overview

The IAM system provides secure access control for the contact form backend:

- **IAM Policy**: `ContactFormSNSPublish` - Allows SNS publish to specific topic only
- **IAM Role**: `contact-form-lambda-role` - Lambda execution role with minimal permissions
- **Security**: Least-privilege access following AWS best practices
- **Integration**: Works with SNS topic from Unit 8.1

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

### Dependencies
- **SNS Topic**: Must complete Unit 8.1 first
- **SNS Configuration**: `sns/config/sns-config.json` must exist

## Scripts

### 🚀 Setup IAM Infrastructure
```bash
# Create IAM role and policy for Lambda function
./iam/scripts/setup-iam.sh
```

**What it does:**
- Creates custom IAM policy for SNS publish permissions
- Creates Lambda execution role with trust policy
- Attaches AWS managed policy for CloudWatch logs
- Attaches custom policy for SNS publishing
- Saves configuration for Lambda integration

**Output:**
- Role ARN (needed for Lambda function)
- Policy ARN and security configuration

### 📊 Check IAM Status
```bash
# Check current IAM configuration and status
./iam/scripts/status-iam.sh
```

**What it shows:**
- Role and policy status
- Attached policies verification
- SNS topic accessibility
- Overall system readiness
- Available commands

### 🧪 Test IAM Permissions
```bash
# Test IAM role permissions end-to-end
./iam/scripts/test-iam.sh
```

**What it does:**
- Verifies role and policy exist
- Tests role assumption (like Lambda would)
- Uses temporary credentials to test SNS publish
- Sends test message to verify permissions work
- Confirms complete security configuration

### 🗑️ Cleanup Infrastructure
```bash
# Remove IAM role and policy
./iam/scripts/destroy-iam.sh
```

**What it removes:**
- Detaches all policies from role
- Deletes IAM role
- Deletes custom IAM policy
- Removes configuration files
- Prompts for confirmation before deletion

## Configuration

### Generated Files
```
iam/
├── config/
│   └── iam-config.json     # Role ARN, policy details
└── scripts/
    ├── setup-iam.sh        # Create infrastructure
    ├── status-iam.sh       # Check status
    ├── test-iam.sh         # Test permissions
    └── destroy-iam.sh      # Cleanup
```

### Configuration Format
```json
{
  "policyName": "ContactFormSNSPublish",
  "policyArn": "arn:aws:iam::123456789012:policy/ContactFormSNSPublish",
  "roleName": "contact-form-lambda-role",
  "roleArn": "arn:aws:iam::123456789012:role/contact-form-lambda-role",
  "topicArn": "arn:aws:sns:us-east-1:123456789012:contact-form-notifications",
  "accountId": "123456789012",
  "region": "us-east-1",
  "createdAt": "2025-08-25T08:35:15Z"
}
```

## Security Architecture

### IAM Policy (Least Privilege)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "SNSPublishToContactFormTopic",
      "Effect": "Allow",
      "Action": [
        "sns:Publish"
      ],
      "Resource": "arn:aws:sns:us-east-1:ACCOUNT-ID:contact-form-notifications"
    }
  ]
}
```

**Security Features:**
- ✅ **Single action**: Only `sns:Publish` allowed
- ✅ **Specific resource**: Only contact form topic accessible
- ✅ **No wildcards**: No broad permissions granted
- ✅ **Minimal scope**: Cannot access other SNS topics or actions

### IAM Role (Lambda Execution)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

**Attached Policies:**
- ✅ **AWSLambdaBasicExecutionRole**: CloudWatch logs (AWS managed)
- ✅ **ContactFormSNSPublish**: SNS publish to specific topic (custom)

## Usage Workflow

### Initial Setup
1. **Complete Unit 8.1**: Ensure SNS topic exists
2. **Run setup script**: `./iam/scripts/setup-iam.sh`
3. **Verify configuration**: `./iam/scripts/status-iam.sh`
4. **Test permissions**: `./iam/scripts/test-iam.sh`

### Daily Operations
- **Check status**: `./iam/scripts/status-iam.sh`
- **Test permissions**: `./iam/scripts/test-iam.sh`
- **Monitor**: AWS Console → IAM → Roles

### Cleanup
- **Remove everything**: `./iam/scripts/destroy-iam.sh`

## Integration with Other Units

### Unit 8.1: SNS Topic
- **Requires**: Topic ARN from `sns/config/sns-config.json`
- **Dependency**: SNS topic must exist before creating IAM permissions
- **Integration**: Policy grants access to specific SNS topic only

### Unit 8.3: Lambda Function
- **Provides**: Role ARN from `iam/config/iam-config.json`
- **Usage**: Lambda function will use this role for execution
- **Permissions**: Role allows Lambda to write logs and publish to SNS

### Unit 8.4: API Gateway
- **Integration**: Lambda function (with this role) will be invoked by API Gateway
- **Security**: Role ensures Lambda can only access required resources

## Security Best Practices

### Least Privilege Access
- **Minimal permissions**: Only what Lambda function needs
- **Specific resources**: No wildcard access to AWS resources
- **Single purpose**: Role designed for contact form Lambda only

### AWS Security Standards
- **No hardcoded credentials**: Uses IAM roles and temporary credentials
- **Service-to-service**: Lambda assumes role, gets temporary credentials
- **Auditable**: All actions logged in CloudTrail
- **Rotatable**: Temporary credentials automatically rotate

### Monitoring and Compliance
- **CloudWatch logs**: Lambda execution logs via basic execution role
- **CloudTrail**: All IAM actions and SNS publishes logged
- **AWS Console**: Role and policy visible in IAM dashboard
- **Testing**: Automated permission testing with temporary credentials

## Troubleshooting

### Common Issues

#### Role Cannot Be Assumed
```bash
# Check trust policy allows Lambda service
aws iam get-role --role-name contact-form-lambda-role
```

#### SNS Publish Permission Denied
```bash
# Test permissions with temporary credentials
./iam/scripts/test-iam.sh
```

#### Policy Not Attached
```bash
# Check attached policies
aws iam list-attached-role-policies --role-name contact-form-lambda-role
```

#### SNS Topic Not Accessible
```bash
# Verify SNS topic exists and ARN is correct
./sns/scripts/status-sns.sh
```

### Success Indicators
- ✅ Role ARN generated and saved
- ✅ Policy created with specific topic access
- ✅ Both policies attached to role
- ✅ Role assumption test passes
- ✅ SNS publish test succeeds

## Next Steps

After IAM setup is complete:

1. **Unit 8.3**: Develop Lambda function using the Role ARN
2. **Unit 8.4**: Set up API Gateway to invoke Lambda
3. **Unit 8.5**: Connect frontend to complete backend

The Role ARN from `iam/config/iam-config.json` will be needed for Lambda function configuration.

## Cost Considerations

### AWS Pricing
- **IAM roles and policies**: Free
- **Role assumptions**: Free
- **CloudWatch logs**: Pay per GB ingested (minimal for contact form)
- **SNS publishes**: Pay per message (minimal cost)

### Cost Optimization
- **Least privilege**: Prevents accidental expensive operations
- **Specific resources**: Cannot access costly services unintentionally
- **Minimal logging**: Basic execution role only logs errors and execution info

## Compliance and Governance

### Security Compliance
- **AWS Well-Architected**: Follows security pillar best practices
- **Principle of least privilege**: Minimal permissions granted
- **Defense in depth**: Multiple layers of access control
- **Audit trail**: Complete logging of all actions

### Governance
- **Infrastructure as Code**: All configuration in version control
- **Reproducible**: Can recreate identical setup in any account
- **Documented**: Complete documentation and usage examples
- **Testable**: Automated testing of permissions and configuration
