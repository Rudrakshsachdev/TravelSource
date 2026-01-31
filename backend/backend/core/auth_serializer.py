
"""
This LoginSerializer is a Django REST Framework serializer designed to handle user authentication during the login process. It accepts a username and a password as input fields, where the password is marked as write_only to ensure it is never included in API responses for security reasons. Inside the validate method, Django’s built-in authenticate function is used to verify the provided credentials against the authentication backends configured in the project. The method retrieves the username and password from the incoming data and checks whether a matching user exists with valid credentials. If authentication fails, a ValidationError is raised with an “Invalid credentials” message, preventing unauthorized access. If authentication is successful, the authenticated user object is added to the validated data dictionary and returned, making it available for further processing such as token generation or session handling in the login view.
"""

from django.contrib.auth import authenticate
from rest_framework import serializers

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            username=data.get("username"),
            password=data.get("password")
        )

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        data["user"] = user
        return data
