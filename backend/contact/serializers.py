from rest_framework import serializers
from .models import ContactMessage


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['name', 'subject', 'message']
        extra_kwargs = {
            'name': {'required': True},
            'subject': {'required': True},
            'message': {'required': True},
        }

    def validate_message(self, value):
        if len(value) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters long.")
        if len(value) > 500:
            raise serializers.ValidationError("Message cannot exceed 500 characters.")
        return value

    def validate_name(self, value):
        if len(value) < 4:
            raise serializers.ValidationError("Name must be at least 4 characters long.")
        return value
