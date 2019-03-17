from .pagination import DefaultPagination
from .serializers import TweetSerializer
from ..models import Tweet

from rest_framework.viewsets import ModelViewSet


class TweetViewSet(ModelViewSet):
    serializer_class = TweetSerializer
    queryset = Tweet.objects.all()
    pagination_class = DefaultPagination

    def perform_create(self, serialiazer):
        return serialiazer.save(user=self.request.user)
