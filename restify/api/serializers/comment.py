from rest_framework import serializers
from ..models.comments import UserRating, CommentChain

# serializer for user rating and comment

class UserRatingSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserRating
        fields = ['user', 'host', 'rating', 'comment', 'created_at']
        read_only_fields = ['host', 'user']


class CommentChainCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = CommentChain
        fields = ['id', 'user', 'host', 'reservation', 'created_at', 'Rating', 'comment', 'hostresponse', 'userresponse']
        read_only_fields = ['user', 'host', 'hostresponse', 'userresponse']


class CommentChainUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = CommentChain
        fields = ['id', 'user', 'host', 'reservation', 'created_at', 'Rating', 'comment', 'hostresponse', 'userresponse']
        read_only_fields =  ['user', 'host', 'reservation', 'created_at', 'Rating', 'comment', 'hostresponse', 'userresponse'] 
