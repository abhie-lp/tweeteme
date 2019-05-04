from ..models import UserProfile
from django.contrib.auth.models import User


def recommended_users(request):
    if request.user.is_authenticated:
        logged_user = request.user
        logged_profile = UserProfile.objects.get(user=logged_user)

        following = list(logged_profile.following.values_list("id", flat=True))
        following.append(logged_user.id)

        users = User.objects.exclude(
            id__in=following
        ).values("id",
                 "username",
                 "first_name",
                 "last_name",
                 "userprofile__profile_thumb").order_by("?")[:6]

        return {"recommended_users": users}

    return {}
