from .models import Tag
from django.shortcuts import render


def tag_detail(request, title):
    tag = Tag.objects.get(title="#"+title)

    return render(request, "tags/tag_tweets_list.html", {"title": tag.title[1:],
                                                         "tweets_count": tag.tweets.count()})
