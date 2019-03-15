from django.db import models
from django.urls import reverse
from django.contrib.auth.models import User


class Tweet(models.Model):
    content = models.CharField(max_length=140)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = "-created_on", "content", "user",

    def __str__(self):
        return self.content

    def get_absolute_url(self):
        return reverse("tweet:detail", args=[self.id])
