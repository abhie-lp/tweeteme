from . import views
from django.urls import path
from django.contrib.auth.views import LoginView, LogoutView

app_name = "user"

urlpatterns = [
    path("<str:username>/followers/", views.get_user_followers, name="user_followers"),
    path("<str:username>/following/", views.get_user_following, name="user_following"),
    path("<str:user>/follow/", views.follow_user, name="follow_user"),
    path("register/", views.RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(template_name="accounts/login.html"), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("<str:username>/", views.user_posts, name="user_posts"),
]
