from .models import Tweet
from django.contrib import admin


@admin.register(Tweet)
class TweetAdmin(admin.ModelAdmin):
    list_display = "id", "content", "user", "created_on", "updated_on",
    list_display_links = "content",
    search_fields = "user",
