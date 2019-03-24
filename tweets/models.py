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


class TweetManager(models.Manager):

    def like_toggle(self, user, tweet_obj):
        liked_by = tweet_obj.likes
        user_liked = False
        if user in liked_by.all():
            liked_by.remove(user)
        else:
            liked_by.add(user)
            user_liked = True
        return user_liked


class Tweet(Post):
    content = models.CharField(max_length=140)
    updated_on = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, blank=True)
    retweets = models.PositiveIntegerField(default=0)

    objects = TweetManager()

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
    
    def save(self, *args, **kwargs):
        if not getattr(self, "id"):
            self.parent_tweet.retweets += 1
            self.parent_tweet.save()
        super(Retweet, self).save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        self.parent_tweet.retweets -= 1
        self.parent_tweet.save()
        super(Retweet, self).delete(*args, **kwargs)

    def __str__(self):
        return self.parent_tweet.content


class Reply(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tweet = models.ForeignKey(Tweet, on_delete=models.CASCADE)
    content = models.CharField(max_length=140)
    created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = "-id",

    def __str__(self):
        return self.content
