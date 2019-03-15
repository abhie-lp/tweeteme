from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("tweet", views.TweetViewSet)

app_name = "tweet_api"

urlpatterns = [
    path("", include(router.urls)),
]
