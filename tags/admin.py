from . import models
from django.contrib import admin


@admin.register(models.Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = "id", "title", "tweets_count",
    list_display_links = "title",
    search_fields = "title",
    raw_id_fields = "tweets",

    def tweets_count(self, inst):
        return inst.tweets.count()
