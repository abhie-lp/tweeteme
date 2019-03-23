from . import models
from django.contrib import admin


@admin.register(models.Post)
class PostAdmin(admin.ModelAdmin):

    def tweet_id(self, inst):
        return inst.tweet.id

    def retweet_id(self, inst):
        return inst.retweet.id

    list_display = "id", "user", "created_on", "tweet_id", "retweet_id",
    list_display_links = "user",


@admin.register(models.Tweet)
class TweetAdmin(admin.ModelAdmin):

    def likes_count(self, inst):
        return inst.likes.count()

    list_display = "id", "content", "user", "created_on", "updated_on", "likes_count",
    list_display_links = "content",
    search_fields = "user",
    readonly_fields = "likes",


@admin.register(models.Retweet)
class RetweetAdmin(admin.ModelAdmin):

    def parent_tweet_id(self, inst):
        return f"{inst.parent_tweet.pk} - {inst.parent_tweet.content[:20]}"

    list_display = "id", "parent_tweet_id", "user", "created_on",
    list_display_links = "id", "parent_tweet_id",
    raw_id_fields = "parent_tweet",
