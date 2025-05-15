from rest_framework import authentication
from rest_framework import exceptions
import requests
from django.conf import settings
import json

class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        # Get the token from the request header
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return None
        
        try:
            # Extract the token
            token = auth_header.split(' ')[1]
            
            # Verify the token with the user service
            response = requests.get(
                f"{settings.USER_SERVICE_URL}/api/auth/verify/",
                headers={"Authorization": f"Bearer {token}"}
            )
            
            if response.status_code != 200:
                raise exceptions.AuthenticationFailed('Invalid token')
            
            # Get user data from the response
            user_data = response.json()
            
            # Create a user object
            class User:
                def __init__(self, user_id, username, is_admin):
                    self.user_id = user_id
                    self.username = username
                    self.is_admin = is_admin
                    self.is_authenticated = True
            
            user = User(
                user_id=user_data['user_id'],
                username=user_data['username'],
                is_admin=user_data['is_admin']
            )
            
            return (user, token)
        except Exception as e:
            raise exceptions.AuthenticationFailed(f'Authentication failed: {str(e)}')