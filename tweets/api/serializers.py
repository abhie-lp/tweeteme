from .. import models

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
        model = models.Tweet
        fields = "id", "content", "created_on", "date_display", "likes", "retweets", "user",

    def get_created_on(self, obj):
        return obj.created_on.strftime("%I:%M %p - %d %b %Y")

    def get_date_display(self, obj):
        obj_date = obj.created_on
        days = (timezone.datetime.now() - obj_date).days
        if days > 0:
            return obj_date.strftime("%d %b")
        else:
            return naturaltime(obj_date)


class RetweetSerializer(serializers.ModelSerializer):
    parent_tweet = TweetSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    date_display = serializers.SerializerMethodField()

    class Meta:
        model = models.Retweet
        fields = "id", "parent_tweet", "user", "date_display",

    def get_date_display(self, obj):
        obj_date = obj.created_on
        days = (timezone.datetime.now() - obj_date).days
        if days > 0:
            return obj_date.strftime("%d %b")
        else:
            return naturaltime(obj_date)


class PostSerializer(serializers.ModelSerializer):
    tweet = TweetSerializer()
    retweet = RetweetSerializer()

    class Meta:
        model = models.Post
        fields = "tweet", "retweet"


class ReplySerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Reply
        fields = "id", "content", "created_on", "tweet", "user",
