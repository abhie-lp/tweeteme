from . import forms, models

from django.shortcuts import render
from django.urls import reverse_lazy
from django.http.response import JsonResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.views.generic.edit import CreateView


def get_follow_text(request, user_id):
    follow_text = "Follow"
    logged_user = request.user
    if logged_user.is_anonymous:
        follow_text = "Login to Follow"
    else:
        logged_profile = request.user.userprofile
        following = list(logged_profile.following.values_list("id", flat=True))
        if user_id in following:
            follow_text = "Unfollow"
    return follow_text


def get_user_followers(request, username):
    url_user = User.objects.get(username=username)

    logged_user = request.user

    user_followers = url_user.following_me.values("id",
                                                  "user__username",
                                                  "user__first_name",
                                                  "user__last_name",
                                                  "profile_thumb")

    # for checking whether the requested user is in the following of logged user
    url_follow_text = "Follow"

    if not logged_user.is_anonymous:

        logged_profile = logged_user.userprofile
        logged_following = logged_profile.following.values_list("id", flat=True)

        for user in user_followers:
            follow_text = "Follow"
            user["follow_text"] = follow_text
            if user["id"] in logged_following:
                follow_text = "Unfollow"
                user["follow_text"] = follow_text

        if url_user.id in logged_following:
            url_follow_text = "Unfollow"
    else:
        for user in user_followers:
            user["follow_text"] = "Login to Follow"
        url_follow_text = "Login to Follow"

    return render(request, "accounts/user_followers.html", {
        "url_follow_text": url_follow_text,
        "followers": user_followers,
        "url_user": url_user,
    })


def get_user_following(request, username):
    logged_user = request.user
    url_user = User.objects.get(username=username)
    user_profile = models.UserProfile.objects.get(user=url_user)
    following = user_profile.following.values("id",
                                              "username",
                                              "first_name",
                                              "last_name",
                                              "userprofile__profile_thumb")

    # for checking whether the requested user is in the following of logged user
    url_follow_text = "Follow"

    if not logged_user.is_anonymous:
        logged_profile = logged_user.userprofile
        logged_following = logged_profile.following.values_list("pk", flat=True)

        for user in following:
            follow_text = "Follow"
            user["follow_text"] = follow_text

            if user["id"] in logged_following:
                follow_text = "Unfollow"
                user["follow_text"] = follow_text

        if url_user.id in logged_following:
            url_follow_text = "Unfollow"
    else:
        for user in following:
            user["follow_text"] = "Login to Follow"
        url_follow_text = "Login to Follow"

    return render(request, "accounts/user_following.html", {
        "following": following,
        "user": url_user,
        "follow_text": url_follow_text})


class RegisterView(CreateView):
    form_class = forms.RegisterForm
    success_url = reverse_lazy("user:login")
    template_name = "accounts/register.html"


def user_posts(request, username):
    user = User.objects.get(username=username)

    return render(request, "accounts/user_posts.html", {
        "user": user,
        "follow_text": get_follow_text(request, user.id)
    })


def follow_user(request, user):
    user_obj = User.objects.get(username=user)
    follow_status = models.UserProfile.objects.toggle_following(user_obj, request.user)
    return JsonResponse({"follow_status": follow_status})


@login_required
def profile_update_view(request):
    logged_user = request.user
    logged_profile = logged_user.userprofile

    if request.method == "POST":
        post_data = request.POST
        u_form = forms.UserUpdateForm(request.POST, instance=logged_user)
        p_form = forms.ProfileUpdateForm(post_data, request.FILES, instance=logged_profile)

        if u_form.is_valid() and p_form.is_valid():
            user = u_form.save(commit=False)
            new_password = u_form.cleaned_data.get("new_password")
            if new_password:
                user.set_password(new_password)
            user.save()
            p_form.save()
            return HttpResponseRedirect(request.path)
    else:
        u_form = forms.UserUpdateForm(instance=logged_user)
        p_form = forms.ProfileUpdateForm(instance=logged_profile)

    return render(request, "accounts/profile_update.html", {"u_form": u_form, "p_form": p_form})
