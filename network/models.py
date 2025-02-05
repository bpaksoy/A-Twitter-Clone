from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save


class User(AbstractUser):
    pass


class Tweet(models.Model):
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    liked = models.ManyToManyField(User, default=None, blank=True)
    user = models.ForeignKey(
        User, null=True, blank=True, related_name="user", on_delete=models.DO_NOTHING)

    def __str__(self):
        return f"{self.id}, {self.content}, {self.created_at}, {self.liked}, {self.user}"

    @property
    def num_likes(self):
        return self.liked.all().count()

    @property
    def tweet_id(self):
        return self.id


LIKE_CHOICES = (
    ("Like", "Like"),
    ("Unlike", "Unlike")
)


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tweet = models.ForeignKey(Tweet, on_delete=models.CASCADE)
    value = models.CharField(choices=LIKE_CHOICES,
                             default="Like", max_length=10)

    def __str__(self):
        return f"User: {self.user}, Tweet: {self.tweet}"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    follows = models.ManyToManyField("self",
                                     related_name="followed_by",
                                     symmetrical=False,
                                     blank=True)

    def __str__(self):
        return f"Username: {self.user.username}, id: {self.user.id}, user: {self.user}"


def create_profile(sender, instance, created, **kwargs):
    if created:
        user_profile = Profile(user=instance)
        user_profile.save()

        # # Have the user follow themselves
        # user_profile.follows.set([instance.profile.id])
        # user_profile.save()


post_save.connect(create_profile, sender=User)
