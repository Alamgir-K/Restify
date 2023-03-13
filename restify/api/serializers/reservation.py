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
    read_only_fields = ['user', 'property', 'status', 'start_date', 'end_date']

    class Meta:
        model = Reservation
        fields = ('id', 'user', 'property', 'start_date', 'end_date', 'price', 'status')

    def update(self, instance, validated_data):
        price = validated_data.get('price')
        if price:
            instance.price = price

        instance.save()
        return instance

    # def get_total_cost(self, obj):
    #     return (obj.end_date - obj.start_date).days * obj.price
