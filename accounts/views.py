from . import forms, models

from django.shortcuts import render
from django.urls import reverse_lazy
from django.http.response import JsonResponse
from django.contrib.auth.models import User
from django.views.generic.edit import CreateView


class RegisterView(CreateView):
    form_class = forms.RegisterForm
    success_url = reverse_lazy("user:login")
    template_name = "accounts/register.html"


def user_posts(request, username):
    user = User.objects.get(username=username)
    follow_text = "Follow"
    logged_user = request.user
    if logged_user.is_anonymous:
        recommended_users = []
        follow_text = "Login to Follow"
    else:
        logged_profile = request.user.userprofile
        following = list(logged_profile.following.values_list("id", flat=True))
        following.append(logged_user.id)
        recommended_users = User.objects.exclude(
            id__in=following
        ).values(
            "id",
            "username",
            "first_name",
            "last_name",
            "userprofile__profile_thumb"
        ).order_by("?")[:6]
        if user.id in following:
            follow_text = "Unfollow"

    return render(request, "accounts/user_posts.html", {"user": user,
                                                        "follow_text": follow_text,
                                                        "recommended_users": recommended_users})


def follow_user(request, user):
    user_obj = User.objects.get(username=user)
    follow_status = models.UserProfile.objects.toggle_following(user_obj, request.user)
    return JsonResponse({"follow_status": follow_status})
