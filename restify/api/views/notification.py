from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListAPIView, UpdateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from ..models.notification import Notification
from ..serializers import NotificationSerializer
from django.shortcuts import get_object_or_404
from ..models.user import CustomUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class NotificationsView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        user = get_object_or_404(CustomUser, user=self.request.user)
        query_set = Notification.objects.filter(user=user, is_cleared=False)

        return query_set


class MarkNotificationReadView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer

    def put(self, request, notification_id):
        notification = get_object_or_404(Notification, id=notification_id)
        if notification.user.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        notification.is_read = True
        notification.save()
        serializer = NotificationSerializer(notification)
        return Response(serializer.data)


class MarkNotificationClearedView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer

    def put(self, request, notification_id):
        notification = get_object_or_404(Notification, id=notification_id)
        if notification.user.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        notification.is_cleared = True
        notification.save()
        serializer = NotificationSerializer(notification)
        return Response(serializer.data)
