from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import ContactMessage
from .serializers import ContactMessageSerializer


@swagger_auto_schema(
    method='post',
    operation_description="Submit a contact form message. The message will be saved to the database and an email notification will be sent.",
    request_body=ContactMessageSerializer,
    responses={
        201: openapi.Response(
            description="Message sent successfully",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'success': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Indicates if the request was successful'),
                    'message': openapi.Schema(type=openapi.TYPE_STRING, description='Success message'),
                }
            )
        ),
        400: openapi.Response(
            description="Bad request - validation errors",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'success': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Indicates if the request was successful'),
                    'errors': openapi.Schema(type=openapi.TYPE_OBJECT, description='Validation errors'),
                    'message': openapi.Schema(type=openapi.TYPE_STRING, description='Error message'),
                }
            )
        ),
    },
    tags=['Contact']
)
@api_view(['POST'])
@permission_classes([AllowAny])
def contact_form(request):
    """
    Handle contact form submissions.
    
    This endpoint accepts contact form data, validates it, saves it to the database,
    and sends an email notification.
    """
    serializer = ContactMessageSerializer(data=request.data)
    
    if serializer.is_valid():
        # Save the message to database
        contact_message = serializer.save()
        
        # Send email notification
        email_sent = False
        email_error = None
        try:
            if not settings.EMAIL_HOST_USER or not settings.EMAIL_HOST_PASSWORD:
                email_error = "Email configuration is missing. Please configure EMAIL_HOST_USER and EMAIL_HOST_PASSWORD in .env file"
                print(f"Email Error: {email_error}")
            else:
                subject = f"Portfolio Contact: {contact_message.subject}"
                message = f"""New contact form submission:

Name: {contact_message.name}
Subject: {contact_message.subject}

Message:
{contact_message.message}

---
This message was sent from your portfolio contact form.
Note: The user will send the email directly from their email client.
"""
                
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[settings.EMAIL_HOST_USER],
                    fail_silently=False,
                )
                email_sent = True
                print(f"Email notification sent successfully to {settings.EMAIL_HOST_USER}")
        except Exception as e:
            email_error = str(e)
            print(f"Error sending email: {email_error}")
            import traceback
            traceback.print_exc()
        
        return Response(
            {
                'success': True,
                'message': 'Your message has been sent successfully! I\'ll get back to you soon.'
            },
            status=status.HTTP_201_CREATED
        )
    
    return Response(
        {
            'success': False,
            'errors': serializer.errors,
            'message': 'Please check the form and try again.'
        },
        status=status.HTTP_400_BAD_REQUEST
    )
