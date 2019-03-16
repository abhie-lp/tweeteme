from ..models import Tweet

from django.contrib.auth.models import User
from django.contrib.humanize.templatetags.humanize import naturaltime
from django.utils import timezone
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = "id", "username", "get_full_name",


class TweetSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    created_on = serializers.SerializerMethodField()
    date_display = serializers.SerializerMethodField()

    class Meta:
        model = Tweet
        fields = "id", "content", "user", "created_on", "date_display",

    def get_created_on(self, obj):
        return obj.created_on.strftime("%I:%M %p - %d %b %Y")

    def get_date_display(self, obj):
        obj_date = obj.created_on
        print(obj_date)
        days = (timezone.datetime.now() - obj_date).days
        print(days)
        if days > 0:
            return obj_date.strftime("%d %b")
        else:

            return naturaltime(obj_date)
