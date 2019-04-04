from . import forms

from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User


@login_required
def tweet_list(request):
    tweet_form = forms.TweetForm()
    logged_user = request.user
    logged_profile = logged_user.userprofile
    following = list(logged_profile.following.values_list("id", flat=True))
    following.append(logged_user.id)
    recommended_users = User.objects.exclude(
                                            id__in=following
                                            ).values("id",
                                                     "username",
                                                     "first_name",
                                                     "last_name",
                                                     "userprofile__profile_thumb").order_by("?")[:6]
    return render(request, "tweets/tweet_list.html", context={
                                                            "tweet_form": tweet_form,
                                                            "recommended_users": recommended_users})
