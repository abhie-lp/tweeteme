from .pagination import DefaultPagination
from .serializers import TweetSerializer
from ..models import Tweet

from rest_framework import filters
from rest_framework.viewsets import ModelViewSet


class TweetViewSet(ModelViewSet):
    serializer_class = TweetSerializer
    queryset = Tweet.objects.all()
    pagination_class = DefaultPagination
    filter_backends = filters.SearchFilter,
    search_fields = "content", "user__username", "user__first_name", "user__last_name",

    def perform_create(self, serialiazer):
        return serialiazer.save(user=self.request.user)
