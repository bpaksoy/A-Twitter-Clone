from rest_framework import serializers
from django.contrib.auth import authenticate


from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class TweetSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    num_likes = serializers.IntegerField(read_only=True)

    class Meta:
        model = Tweet
        fields = '__all__'


class LikeSerializer(serializers.ModelSerializer):
    user = serializers.CharField()
    tweet = serializers.CharField(read_only=True)
    tweet_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Like
        fields = '__all__'


class FollowSerializer(serializers.ModelSerializer):
    follows = serializers.StringRelatedField(many=True)
    followed_by = serializers.StringRelatedField(many=True)

    class Meta:
        model = Profile
        fields = '__all__'



class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(
        label='Username',
        write_only=True
    )
    password = serializers.CharField(
        label='Password',
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True
    )

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            # Try to authenticate the user using Django auth framework.
            user = authenticate(request=self.context.get('request'),
                                username=username, password=password)
            if not user:
                msg = 'Access denied: wrong username or password.'
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Both "username" and "password" are required.'
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs
