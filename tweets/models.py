from django.db import models
from django.urls import reverse
from django.utils import timezone
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
    likes = models.ManyToManyField(User, blank=True)

    def __str__(self):
        return self.content


class RetweetManager(models.Manager):

    def retweeted_today(self, user, parent_tweet):
        print("Entered manager")
        current_date = timezone.now()
        qs = self.get_queryset().filter(user=user,
                                        parent_tweet=parent_tweet,
                                        created_on__year=current_date.year,
                                        created_on__month=current_date.month,
                                        created_on__day=current_date.day)
        if qs.exists():
            print("Returning None")
            return True
        else:
            return False
        

class Retweet(Post):
    parent_tweet = models.ForeignKey(Tweet, on_delete=models.CASCADE, related_name="retweet")
    objects = RetweetManager()

    def __str__(self):
        return self.parent_tweet.content
