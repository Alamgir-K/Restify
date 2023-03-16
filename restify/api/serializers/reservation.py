from rest_framework import serializers
from ..models.user import CustomUser
from ..models.reservation import Reservation
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password


class ReservationCreateSerializer(serializers.ModelSerializer):
    user_username = serializers.ReadOnlyField(source='user.user.username')
    user_id = serializers.ReadOnlyField(source="user.id")

    class Meta:
        model = Reservation
        fields = ['id', 'property',
                            'start_date', 'end_date', 'created_at', 'guest', 'message', 'status', 'user_id', 'user_username']

        read_only_fields = ['status']


class ReservationUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Reservation
        fields = ['user', 'property',
                            'start_date', 'end_date', 'created_at', 'guest', 'message', 'status']

        read_only_fields = ['user', 'property',
                            'start_date', 'end_date', 'created_at', 'guest', 'message']
