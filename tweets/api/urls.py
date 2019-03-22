from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("tweet", views.TweetViewSet)
router.register("retweet", views.RetweetViewSet)

app_name = "tweet_api"

urlpatterns = [
    path("model/", include(router.urls)),
    path("", views.PostListAPIView.as_view(), name="posts_list"),
]
