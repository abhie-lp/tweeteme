from ..models import Tweet
from django.test import TestCase
from django.contrib.auth.models import User


class TweetModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="django_man",
            email="django@python.com",
            password="django123",
        )

    def test_model_works_correctly(self):
        Tweet.objects.create(content="First tweet", user=self.user)
        Tweet.objects.create(content="Second tweet", user=self.user)
        tweets = Tweet.objects.all()

        self.assertEqual(len(tweets), 2)
        self.assertEqual(Tweet.objects.first().user, self.user)
        self.assertEqual(Tweet.objects.first().content, "Second tweet")
