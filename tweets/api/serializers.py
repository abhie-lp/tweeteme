from ..models import Tweet
from rest_framework import serializers


class TweetSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tweet
        fields = "id", "content", "user", "created_on", "updated_on",
        read_only_fields = "user",
