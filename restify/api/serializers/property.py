from rest_framework import serializers
from ..models.user import CustomUser
from ..models.rentalproperty import RentalProperty
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

class ArrayFieldSerializer(serializers.ListField):
    child = serializers.CharField(max_length=700)

    def to_representation(self, data):
        return data

class PropertySerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField('get_owner_name')

    class Meta:
        model = RentalProperty
        fields = ['owner', 'name', 'address', 'max_guests', 'beds', 'baths', 'description', 'amenities']

    def get_owner_name(self, RentalProperty):
        owner = RentalProperty.owner.username
        return owner

