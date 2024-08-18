from django import views
import json
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.utils.decorators import method_decorator
from django.contrib import messages
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from rest_framework.views import APIView
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect, csrf_exempt
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListAPIView


from .serializers import *


from .models import *
from .forms import *


ensure_csrf = method_decorator(ensure_csrf_cookie)


class setCSRFCookie(APIView):
    permission_classes = []
    authentication_classes = []

    @ensure_csrf
    def get(self, request):
        return Response("CSRF Cookie set.")


@api_view(["GET", "POST", "DELETE"])
@authentication_classes([])
@permission_classes([])
def tweets(request):
    if request.method == "GET":
        tweets = Tweet.objects.order_by("-created_at")
        serializer = TweetSerializer(tweets, many=True)
        return Response(status=status.HTTP_200_OK, data={"data": serializer.data})
    elif request.method == "POST":
        data = request.data
        serializer = TweetSerializer(
            data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED, data={"data": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST", "DELETE"])
@permission_classes([IsAuthenticated])
def tweets_by_followed_users(request, id):
    if request.user.is_authenticated:
        followed_users = request.user.profile.follows
        # followed_users = Profile.objects.filter(
        #     follows__user=request.user)
        # print("followed users", followed_users)
        pk = followed_users.values('user_id').exclude(user_id=id)
        # print("pk", pk)
        tweets = Tweet.objects.filter(
            user__in=pk).order_by("-created_at")
        serializer = TweetSerializer(tweets, many=True)
        # print("followed user tweets", serializer.data)
        return Response(status=status.HTTP_200_OK, data={"data": serializer.data})
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# This will return a list of tweets
@api_view(["GET", "POST", "DELETE"])
@authentication_classes([])
@permission_classes([])
def tweet_view(request, id):
    tweet = Tweet.objects.get(id=id)
    # print("TWEET in tweet_view", tweet)
    data = request.data
    # print("DATA in tweet_view", data, type(id))
    if request.method == "GET":
        serializer = TweetSerializer(tweet)
        return Response(status=status.HTTP_200_OK, data={"data": serializer.data})

    if request.method == "POST":
        # print("DATA in tweet_view post req.", data)
        serializer = TweetSerializer(tweet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED, data={"data": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST", "DELETE", "PUT"])
@permission_classes([IsAuthenticated])
def likes(request):
    user = request.user
    if request.method == "GET":
        like_list = Like.objects.filter(user=user)
        serializer = LikeSerializer(like_list, many=True)
        return Response(status=status.HTTP_201_CREATED, data={"liked_tweets": serializer.data})
    if request.method == "POST":
        data = request.data
        tweet_id = int(data["tweet_id"])
        tweet = Tweet.objects.get(id=tweet_id)

        if user in tweet.liked.all():
            tweet.liked.remove(user)
        else:
            tweet.liked.add(user)

        like, created = Like.objects.get_or_create(
            user=user, tweet=tweet)

        if not created:
            if like.value == "Like":
                like.value == "Unlike"
            else:
                like.value == "Like"

        like.save()
        tweet = Tweet.objects.get(id=tweet_id)
        serializer = TweetSerializer(tweet)
        return Response(status=status.HTTP_201_CREATED, data={"tweet": serializer.data})

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST", "DELETE"])
@authentication_classes([])
@permission_classes([])
def get_user(request, id):
    try:
        user_tweets = Tweet.objects.filter(user=id).order_by("-created_at")
        user = User.objects.get(pk=id)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        serializer = TweetSerializer(user_tweets, many=True)
        user_serializer = UserSerializer(user)
        return Response(status=status.HTTP_200_OK, data={"tweets": serializer.data,
                                                         "user": user_serializer.data})
    elif request.method == "DELETE":
        user_tweets.delete()
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == "POST":
        serializer = TweetSerializer(user_tweets, user_tweets=request.data)
        user_serializer = UserSerializer(user, user=request.user)
        if serializer.is_valid() and user_serializer.is_valid():
            serializer.save()
            user_serializer.save()
            return Response({"tweets": serializer.data,
                             "user": user_serializer.data
                             })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def index(request):
    return render(request, "build/index.html")


csrf_protect_method = method_decorator(csrf_protect)


class UserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    lookup_field = 'id'

    def get_object(self, *args, **kwargs):
        return self.request.user


class CsrfExemptSessionAuthentication(SessionAuthentication):

    def enforce_csrf(self):
        return self.request.user  # To not perform the csrf check previously happening


class ProfileView(generics.RetrieveAPIView):
    authentication_classes = (SessionAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer
    queryset = User.objects.all()
    # print("queryset", queryset)

    def get_object(self):
        return self.request.user


@api_view(["GET", "POST", "DELETE"])
@permission_classes([IsAuthenticated])
def profile_follow_list(request, id):
    if request.user.is_authenticated:
        # print("request.user", request.user.id)
        profile = Profile.objects.filter(user=request.user)
        # print('profiles in follow_list', profile)
        serializer = FollowSerializer(profile, many=True)
        # print("serializer.data", serializer.data)
        return Response(status=status.HTTP_200_OK, data={"follow_list": serializer.data})
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST", "DELETE"])
@permission_classes([IsAuthenticated])
def follow(request, id):
    if request.user.is_authenticated:
        profile = Profile.objects.get(user_id=id)
        # print("profile Follow:", profile)
        current_user_profile = request.user.profile
        current_user_profile.follows.add(profile)
        current_user_profile.save()
        new_profile = Profile.objects.filter(user=request.user)
        serializer = FollowSerializer(new_profile, many=True)
        # print("Follow serializer", serializer.data)
        return Response(status=status.HTTP_200_OK, data={"follow_list": serializer.data})
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST", "DELETE"])
@permission_classes([IsAuthenticated])
def unfollow(request, id):
    if request.user.is_authenticated:
        profile = Profile.objects.get(user_id=id)
        # print("profile unfollow:", profile)
        current_user_profile = request.user.profile

        current_user_profile.follows.remove(profile)
        current_user_profile.save()
        new_profile = Profile.objects.filter(user=request.user)
        serializer = FollowSerializer(new_profile, many=True)
        # print("Unfollow serializer", serializer.data)
        return Response(status=status.HTTP_200_OK, data={"follow_list": serializer.data})
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST", "DELETE"])
@permission_classes([IsAuthenticated])
def user_follow_list(request, id):
    if request.user.is_authenticated:
        print("request.user", request.user.id)
        profile = Profile.objects.filter(user_id=id)
        # print('profiles in user_follow_list', profile)
        serializer = FollowSerializer(profile, many=True)
        # print("serializer.data in user follow list", serializer.data)
        return Response(status=status.HTTP_200_OK, data={"follow_list": serializer.data})
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST", "DELETE"])
@permission_classes([IsAuthenticated])
def user_follow(request, id):
    if request.user.is_authenticated:
        profile = Profile.objects.get(user_id=id)
        # print("user profile Follow:", profile)
        current_user_profile = request.user.profile
        current_user_profile.follows.add(profile)
        current_user_profile.save()
        new_profile = Profile.objects.filter(user_id=id)
        serializer = FollowSerializer(new_profile, many=True)
        # print("serializer.data in user follow link", serializer.data)
        return Response(status=status.HTTP_200_OK, data={"follow_list": serializer.data})
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST", "DELETE"])
@permission_classes([IsAuthenticated])
def user_unfollow(request, id):
    if request.user.is_authenticated:
        profile = Profile.objects.get(user_id=id)
        # print("user profile UnFollow:", profile)
        current_user_profile = request.user.profile
        current_user_profile.follows.remove(profile)
        current_user_profile.save()
        new_profile = Profile.objects.filter(user_id=id)
        serializer = FollowSerializer(new_profile, many=True)
        # print("serializer.data in user unfollow link", serializer.data)
        return Response(status=status.HTTP_200_OK, data={"follow_list": serializer.data})
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

    # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


class ApiTweetListView(ListAPIView):
    queryset = Tweet.objects.order_by("-created_at")
    serializer_class = TweetSerializer
    authentication_classes = ()
    permission_classes = ()
    pagination_class = PageNumberPagination
