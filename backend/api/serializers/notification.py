from rest_framework import serializers
from ..models.notification import Notification


class NotificationSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.user.username')
    user_id = serializers.ReadOnlyField(source="user.id")

    class Meta:
        model = Notification
        fields = ['id', 'user_id', 'username', 'message',
                  'is_read', 'is_cleared', 'created_at']
        read_only_fields = ['message', 'is_read', 'is_cleared']
