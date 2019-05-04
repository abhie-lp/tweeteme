from . import  views
from django.urls import path

app_name = "tag"

urlpatterns = [
    path("<str:title>/", views.tag_detail, name="tweets_list"),
]
