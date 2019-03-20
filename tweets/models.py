from django.db import models
from django.urls import reverse
from django.contrib.auth.models import User


class Post(models.Model):
    """Base model for user post"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = "-created_on", "user",


class Tweet(Post):
    content = models.CharField(max_length=140)
    updated_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content


class Retweet(Post):
    parent_tweet = models.ForeignKey(Tweet, on_delete=models.CASCADE, related_name="retweet")

    def __str__(self):
        return self.parent_tweet.content
