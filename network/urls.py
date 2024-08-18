from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("api/profile/", views.ProfileView.as_view(), name="profile"),
    path("api/setcsrf", views.setCSRFCookie.as_view(), name='setcsrf'),
    path("api/list", views.ApiTweetListView.as_view(), name="list"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("tweets", views.tweets, name="tweets"),
    path("tweets/<int:id>", views.tweet_view, name="tweet"),
    path("likes", views.likes, name="likes"),
    path('follow/<int:id>', views.follow, name="follow"),
    path('unfollow/<int:id>', views.unfollow, name="unfollow"),
    path("user/<int:id>/follows", views.profile_follow_list, name="follows"),
    path("user/<int:id>/following", views.user_follow_list, name="following"),
    path("user/<int:id>/followed_users",
         views.tweets_by_followed_users, name="following"),
    path("tweets/users/<int:id>", views.get_user, name="user")
]
