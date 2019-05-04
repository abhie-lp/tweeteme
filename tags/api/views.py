from tweets.api.serializers import PostSerializer
from ..models import Tag
from tweets.api.pagination import DefaultPagination
from rest_framework.generics import ListAPIView


class TagTweetsListAPIView(ListAPIView):
    serializer_class = PostSerializer
    pagination_class = DefaultPagination

    def get_queryset(self):
        tag_title = self.kwargs.get("title")
        try:
            tag = Tag.objects.get(title="#"+tag_title)
        except Tag.DoesNotExist:
            return []
        else:
            return tag.tweets.all()
