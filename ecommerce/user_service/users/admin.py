from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'fullname', 'email', 'address', 'city', 'tel', 'created_at')
    search_fields = ('username', 'fullname', 'email', 'address', 'city', 'tel')
    list_filter = ('city',)
