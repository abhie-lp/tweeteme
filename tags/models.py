from django.db import models


class Tag(models.Model):
    title = models.CharField(max_length=140)
    tweets = models.ManyToManyField("tweets.Post", blank=True)
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
