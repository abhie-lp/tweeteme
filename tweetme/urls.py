from tweets import views
from accounts import views as acc_view

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("api/tag/", include("tags.api.urls", namespace="tag_api")),
    path('admin/', admin.site.urls),
    path("tweet/", include("tweets.urls", namespace="tweet")),
    path("tag/", include("tags.urls", namespace="tag")),
    path("myaccount/", acc_view.profile_update_view, name="myprofile"),
    path("api/", include("tweets.api.urls", namespace="tweet_api")),
    path("user/", include("accounts.urls", namespace="user")),
    path("", views.tweet_list, name="home")
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
