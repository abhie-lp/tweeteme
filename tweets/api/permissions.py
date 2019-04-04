from rest_framework import permissions


class ChangeOwnPost(permissions.BasePermission):
    """Allow user to delete their own tweet or retweet only."""

    def has_object_permission(self, request, view, obj):

        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.user == request.user
