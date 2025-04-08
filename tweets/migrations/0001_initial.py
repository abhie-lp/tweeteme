# Generated by Django 5.2 on 2025-04-08 19:44

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('-created_on', 'user'),
            },
        ),
        migrations.CreateModel(
            name='Tweet',
            fields=[
                ('post_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tweets.post')),
                ('content', models.CharField(max_length=140)),
                ('updated_on', models.DateTimeField(auto_now_add=True)),
                ('retweets', models.PositiveIntegerField(default=0)),
                ('has_tag', models.BooleanField(default=False)),
                ('likes', models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL)),
            ],
            bases=('tweets.post',),
        ),
        migrations.CreateModel(
            name='Retweet',
            fields=[
                ('post_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tweets.post')),
                ('parent_tweet', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='retweet', to='tweets.tweet')),
            ],
            bases=('tweets.post',),
        ),
        migrations.CreateModel(
            name='Reply',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.CharField(max_length=140)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('likes', models.ManyToManyField(blank=True, related_name='likes', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('tweet', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tweets.tweet')),
            ],
            options={
                'ordering': ('-id',),
            },
        ),
    ]
