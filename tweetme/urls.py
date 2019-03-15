from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("tweet/", include("tweets.urls", namespace="tweet")),
    path("tweet-api/", include("tweets.api.urls", namespace="tweet_api")),
]
