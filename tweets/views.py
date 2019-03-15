from django.shortcuts import render


def tweet_list(request):
    return render(request, "tweets/tweet_list.html")
