from rest_framework import serializers
from ..models.user import CustomUser
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(
        required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'password2',
                  'first_name', 'last_name', 'email']


class CustomUserSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = CustomUser
        fields = '__all__'

    def create(self, validated_data):
        # user_data = validated_data['user']

        # if User.objects.filter(username=user_data.get('username', '')):
        #     raise serializers.ValidationError(
        #         {"username": "A user with this username already exists"})
        # elif user_data.get('password', '') != user_data.get('password2', ''):
        #     raise serializers.ValidationError(
        #         {"password2": "The passwords do not match"})

        # user_object = User.objects.create(
        #     username=user_data.get('username', ''),
        #     email=user_data.get('email', ''),
        #     first_name=user_data.get('first_name', ''),
        #     last_name=user_data.get('last_name', '')
        # )
        # user_object.set_password(user_data.get('password', ''))
        # user = user_object.custom_user

        # user.phone_number = validated_data.get('phone_number', '')

        # if validated_data.get('avatar', ''):
        #     user.avatar = validated_data['avatar']
        # user.is_host = validated_data.get('is_host', '')

        # user_object.save()

        # return user_object.custom_user

        user_data = validated_data['user']

        if User.objects.filter(username=user_data.get('username', '')):
            raise serializers.ValidationError(
                {"username": "A user with this username already exists"})
        elif user_data.get('password', '') != user_data.get('password2', ''):
            raise serializers.ValidationError(
                {"password2": "The passwords do not match"})

        user_object = User.objects.create(
            username=user_data.get('username', ''),
            email=user_data.get('email', ''),
            first_name=user_data.get('first_name', ''),
            last_name=user_data.get('last_name', '')
        )
        user_object.set_password(user_data.get('password', ''))
        user_object.save()  # Save the user object to create the related CustomUser object

        custom_user = user_object.custom_user
        custom_user.phone_number = validated_data.get('phone_number', '')

        if validated_data.get('avatar', ''):
            custom_user.avatar = validated_data['avatar']
        custom_user.is_host = validated_data.get('is_host', '')

        custom_user.save()
        return custom_user

    def update(self, instance, validated_data):
        user_data = validated_data['user']

        if instance.user.username != user_data.get('username', ''):
            raise serializers.ValidationError(
                {"username": "You are not allowed to change your username"})
        elif user_data.get('password', '') != user_data.get('password2', ''):
            raise serializers.ValidationError(
                {"password2": "The passwords do not match"})

        if user_data.get('password'):
            instance.user.set_password(user_data.get('password'))

        if user_data.get('first_name'):
            instance.user.first_name = user_data.get('first_name')

        if user_data.get('last_name'):
            instance.user.last_name = user_data.get('last_name')

        if user_data.get('email'):
            instance.user.email = user_data.get('email')

        if validated_data.get('phone_number'):
            instance.phone_number = validated_data.get('phone_number')

        if validated_data.get('avatar'):
            instance.avatar = validated_data.get('avatar')

        if validated_data.get('is_host'):
            instance.is_host = validated_data.get('is_host')

        instance.user.save()
        instance.save()
        return instance
