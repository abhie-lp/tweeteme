from . import views
from django.urls import path

app_name = "tag_api"

urlpatterns = [
    path("<str:title>/", views.TagTweetsListAPIView.as_view(), name="tweets_list"),
]
