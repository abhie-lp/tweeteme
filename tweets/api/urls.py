from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("tweet", views.TweetViewSet)
router.register("retweet", views.RetweetViewSet)
router.register("posts", views.PostListViewSet)

app_name = "tweet_api"

urlpatterns = [
    path("", include(router.urls)),
]
