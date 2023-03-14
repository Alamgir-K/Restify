from rest_framework import serializers
from ..models.notification import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

    def create(self, validated_data):
        notification = Notification.objects.create(**validated_data)
        return notification

    # def update(self, instance, validated_data):
    #     instance.is_read = validated_data.get('is_read', instance.is_read)
    #     instance.save()
    #     return instance
