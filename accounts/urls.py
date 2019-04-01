from . import views
from django.urls import path
from django.contrib.auth.views import LoginView, LogoutView

app_name = "user"

urlpatterns = [
    path("<str:user>/follow/", views.follow_user, name="follow_user"),
    path("register/", views.RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(template_name="accounts/login.html"), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("<str:username>/", views.user_posts, name="user_posts"),
]
