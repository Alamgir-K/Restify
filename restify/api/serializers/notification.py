from rest_framework import serializers
from ..models.notification import UserNotification


class UserNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNotification
        fields = '__all__'

    def create(self, validated_data):
        notification = UserNotification.objects.create(**validated_data)
        return notification

    # def update(self, instance, validated_data):
    #     instance.is_read = validated_data.get('is_read', instance.is_read)
    #     instance.save()
    #     return instance
