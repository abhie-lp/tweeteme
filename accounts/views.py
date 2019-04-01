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
    follow_text = models.UserProfile.objects.is_following(user, request.user)
    return render(request, "accounts/user_posts.html", {"user": user, "follow_text": follow_text})


def follow_user(request, user):
    user_obj = User.objects.get(username=user)
    follow_status = models.UserProfile.objects.toggle_following(user_obj, request.user)
    return JsonResponse({"follow_status": follow_status})
