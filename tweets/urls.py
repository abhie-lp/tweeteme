from . import views
from django.urls import path

app_name = "tweet"

urlpatterns = [
    path("", views.tweet_list, name="list"),
]
