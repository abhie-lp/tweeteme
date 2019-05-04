from . import forms

from django.shortcuts import render
from django.db.models import Q
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User


@login_required
def tweet_list(request):
    tweet_form = forms.TweetForm()
    logged_user = request.user
    logged_profile = logged_user.userprofile

    context = {"tweet_form": tweet_form}

    following = list(logged_profile.following.values_list("id", flat=True))
    following.append(logged_user.id)

    search = request.GET.get("search")

    # Search results of the Users

    if search:
        search_results = User.objects.filter(
            Q(username__icontains=search) |
            Q(first_name__icontains=search) |
            Q(last_name__icontains=search)).values(
            "id",
            "username",
            "first_name",
            "last_name",
            "userprofile__profile_thumb",
        )

        search_following = []
        not_following = []

        for user in search_results:
            user_id = user["id"]
            if user_id in following:
                search_following.append(user)
            else:
                not_following.append(user)

        context["search"] = True
        context["search_following"] = search_following
        context["not_following"] = not_following

        if not search_results:
            context["no_result"] = True

    return render(request, "tweets/tweet_list.html", context=context)
