from . import pagination, serializers
from .. import models

from rest_framework import filters, viewsets, generics, response, exceptions, views


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
        parent_tweet_id = self.request.POST.get("parent_tweet")
        parent_tweet = models.Tweet.objects.get(id=parent_tweet_id)
        retweeted_today = models.Retweet.objects.retweeted_today(user=self.request.user, parent_tweet=parent_tweet)
        if retweeted_today:
            raise exceptions.ValidationError("Already Retweeted today")
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


class TweetLikeAPIView(views.APIView):

    def get(self, *args, **kwargs):
        tweet_id = self.kwargs.get("tweet_id")
        tweet_model = models.Tweet
        tweet = tweet_model.objects.get(id=tweet_id)
        liked = tweet_model.objects.like_toggle(user=self.request.user, tweet_obj=tweet)
        return response.Response({"liked": liked})


class ReplyViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.ReplySerializer
    queryset = models.Reply.objects.all()
    pagination_class = pagination.DefaultPagination

    def get_queryset(self):
        tweet_id = self.request.GET.get("tweet_id", None)
        if tweet_id:
            replies = models.Reply.objects.filter(tweet__id=tweet_id)
            return replies
        return super(ReplyViewSet, self).get_queryset()

    def perform_create(self, serializer):
        tweet_id = self.request.POST.get("tweet_id")
        tweet = models.Tweet.objects.get(id=tweet_id)
        return serializer.save(user=self.request.user, tweet=tweet)
