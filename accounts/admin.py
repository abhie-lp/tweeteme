from .models import UserProfile
from django.contrib import admin


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = "id", "user", "profile_pic", "profile_thumb",
    list_display_links = "user",
    search_fields = "user",
    readonly_fields = "profile_thumb", "following",
