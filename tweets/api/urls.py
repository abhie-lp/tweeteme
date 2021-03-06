from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("tweet", views.TweetViewSet)
router.register("retweet", views.RetweetViewSet)
router.register("reply", views.ReplyViewSet)

app_name = "tweet_api"

urlpatterns = [
    path("like/tweet/<int:tweet_id>/", views.TweetLikeAPIView.as_view(), name="tweet_like"),
    path("like/reply/<int:reply_id>/", views.ReplyLikeAPIView.as_view(), name="reply_like"),
    path("model/", include(router.urls)),
    path("", views.PostListAPIView.as_view(), name="posts_list"),
]
