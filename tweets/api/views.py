from . import pagination, serializers
from .. import models

from rest_framework import filters, viewsets, generics


class TweetViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.TweetSerializer
    queryset = models.Tweet.objects.all()
    pagination_class = pagination.DefaultPagination
    filter_backends = filters.SearchFilter,
    search_fields = "content", "user__username", "user__first_name", "user__last_name",

    def perform_create(self, serialiazer):
        return serialiazer.save(user=self.request.user)


class RetweetViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.RetweetSerializer
    queryset = models.Retweet.objects.all()
    pagination_class = pagination.DefaultPagination

    def perform_create(self, serializer):
        print("in perform create")
        parent_tweet_id = self.request.POST.get("parent_tweet")
        print(parent_tweet_id)
        parent_tweet = models.Tweet.objects.get(id=parent_tweet_id)
        return serializer.save(parent_tweet=parent_tweet, user=self.request.user)


class PostListAPIView(generics.ListAPIView):
    serializer_class = serializers.PostSerializer
    queryset = models.Post.objects.all()
    pagination_class = pagination.DefaultPagination
    filter_backends = filters.SearchFilter,
    search_fields = ("tweet__content",
                     "retweet__parent_tweet__content",
                     "user__username",
                     "user__first_name",
                     "user__last_name",)
