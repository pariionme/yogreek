import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'product_service.settings_prod')
django.setup()

from django.contrib.auth.models import User
from django.db import IntegrityError

def create_superuser():
    try:
        # Try to get existing superuser
        try:
            admin_user = User.objects.get(username='admin')
            # Update password for existing user
            admin_user.set_password('Admin123!')
            admin_user.is_superuser = True
            admin_user.is_staff = True
            admin_user.save()
            print('Superuser password updated successfully')
        except User.DoesNotExist:
            # Create new superuser if doesn't exist
            User.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='Admin123!'
            )
            print('Superuser created successfully')
    except Exception as e:
        print(f'An error occurred: {e}')

if __name__ == '__main__':
    create_superuser() 