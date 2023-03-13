from rest_framework import serializers
from ..models.user import CustomUser
from ..models.reservation import Reservation, Request
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

# class ArrayFieldSerializer(serializers.ListField):
#     child = serializers.CharField(max_length=700)

#     def to_representation(self, data):
#         return data

class ReservationSerializer(serializers.ModelSerializer):
    total_cost = serializers.SerializerMethodField(method_name='get_total_cost')

    class Meta:
        model = Reservation
        fields = ('id', 'user', 'property', 'start_date', 'end_date', 'price', 'status', 'total_cost')

    def get_total_cost(self, obj):
        return (obj.end_date - obj.start_date).days * obj.price
