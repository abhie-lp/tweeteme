from . import forms
from django.shortcuts import render


def tweet_list(request):
    tweet_form = forms.TweetForm()
    return render(request, "tweets/tweet_list.html", context={"tweet_form": tweet_form})
