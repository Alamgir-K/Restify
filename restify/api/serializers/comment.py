from rest_framework import serializers
from ..models.user import CustomUser
from ..models.reservation import Reservation, Request
from ..models.comments import UserRating, CommentChain, UserComment
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

# serializer for user rating and comment

class UserRatingSerializer(serializers.ModelSerializer):
    read_only_fields = ['user', 'host', 'rating', 'comment', 'created_at']

    class Meta:
        model = UserRating
        fields = ('id', 'user', 'host', 'rating', 'comment', 'created_at')


class CommentChainSerializer(serializers.ModelSerializer):
    read_only_fields = ['user', 'host', 'reservation', 'created_at', 'Rating', 'comment', 'hostresponse', 'userresponse']

    class Meta:
        model = CommentChain
        fields = ('id', 'user', 'host', 'reservation', 'created_at', 'Rating', 'comment', 'hostresponse', 'userresponse')