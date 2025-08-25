import json
import boto3
import logging
import os
from datetime import datetime
from botocore.exceptions import ClientError

# Configure logging
logger = logging.getLogger()
logger.setLevel(os.environ.get('LOG_LEVEL', 'INFO'))

# Initialize SNS client
sns_client = boto3.client('sns')

def lambda_handler(event, context):
    """
    AWS Lambda handler for processing contact form submissions.
    
    Expected input from conversational email flow:
    {
        "name": "John Doe",
        "email": "john@example.com", 
        "message": "I love your AWS articles...",
        "verificationPassed": true,
        "timestamp": "2025-08-25T08:47:33.494Z"
    }
    """
    
    # Log request start
    request_id = context.aws_request_id
    logger.info(f"Processing contact form submission - Request ID: {request_id}")
    
    try:
        # Parse request body
        if 'body' not in event:
            logger.error("No body in event")
            return create_error_response(400, "Missing request body")
        
        try:
            body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in request body: {e}")
            return create_error_response(400, "Invalid JSON format")
        
        # Extract and validate required fields
        name = body.get('name', '').strip()
        email = body.get('email', '').strip()
        message = body.get('message', '').strip()
        verification_passed = body.get('verificationPassed', False)
        timestamp = body.get('timestamp', datetime.utcnow().isoformat() + 'Z')
        
        logger.info(f"Processing submission from: {name} <{email}>")
        
        # Basic validation
        validation_error = validate_input(name, email, message, verification_passed)
        if validation_error:
            logger.warning(f"Validation failed: {validation_error}")
            return create_error_response(400, validation_error)
        
        # Format notification message for Roberto
        notification_message = format_notification_message(
            name, email, message, timestamp, request_id
        )
        
        # Send notification via SNS
        topic_arn = os.environ.get('SNS_TOPIC_ARN')
        if not topic_arn:
            logger.error("SNS_TOPIC_ARN environment variable not set")
            return create_error_response(500, "Server configuration error")
        
        try:
            response = sns_client.publish(
                TopicArn=topic_arn,
                Subject=f'Contact Form: {name}',
                Message=notification_message
            )
            
            message_id = response.get('MessageId')
            logger.info(f"SNS message sent successfully - MessageId: {message_id}")
            
        except ClientError as e:
            error_code = e.response['Error']['Code']
            error_message = e.response['Error']['Message']
            logger.error(f"SNS publish failed - {error_code}: {error_message}")
            return create_error_response(500, "Failed to send notification")
        
        # Log success
        logger.info(f"Contact form processed successfully for {name}")
        
        # Return success response
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',  # Configure properly in production
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST'
            },
            'body': json.dumps({
                'message': 'Message sent successfully!',
                'requestId': request_id
            })
        }
        
    except Exception as e:
        logger.error(f"Unexpected error processing contact form: {str(e)}", exc_info=True)
        return create_error_response(500, "Internal server error")

def validate_input(name, email, message, verification_passed):
    """
    Validate contact form input data.
    
    Returns error message if validation fails, None if valid.
    """
    
    # Check required fields
    if not name:
        return "Name is required"
    
    if not email:
        return "Email is required"
    
    if not message:
        return "Message is required"
    
    # Check field lengths
    if len(name) > 100:
        return "Name is too long (max 100 characters)"
    
    if len(message) > 5000:
        return "Message is too long (max 5000 characters)"
    
    # Basic email format validation
    if '@' not in email or '.' not in email.split('@')[-1]:
        return "Invalid email format"
    
    if len(email) > 254:  # RFC 5321 limit
        return "Email address is too long"
    
    # Check verification status
    if not verification_passed:
        return "Human verification required"
    
    return None  # All validations passed

def format_notification_message(name, email, message, timestamp, request_id):
    """
    Format the notification message for Roberto.
    """
    
    return f"""Contact Form Submission

Name: {name}
Email: {email}

Message:
{message}

Submitted: {timestamp}
Verification: Passed
Source: Conversational Email Flow
Request ID: {request_id}

---
This message was sent through the conversational email system on your website.
Reply directly to {email} to respond to {name}."""

def create_error_response(status_code, error_message):
    """
    Create standardized error response.
    """
    
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',  # Configure properly in production
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST'
        },
        'body': json.dumps({
            'error': error_message
        })
    }
