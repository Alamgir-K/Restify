from django.db import models
from ..models.user import CustomUser
from ..models.reservation import Reservation


class Notification(models.Model):
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='notifications')
    reservation = models.ForeignKey(
        Reservation, on_delete=models.CASCADE, default=None)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
