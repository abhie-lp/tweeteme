from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path("tweet/", include("tweets.urls", namespace="tweet")),
    path("tweet-api/", include("tweets.api.urls", namespace="tweet_api")),
    path("user/", include("accounts.urls", namespace="user")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
