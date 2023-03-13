from django.db import models
from django.contrib.auth.models import User
from . import RentalProperty

class Reservation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservations', default=None)
    property = models.ForeignKey(RentalProperty, on_delete=models.CASCADE, related_name='reservations')
    start_date = models.DateField()
    end_date = models.DateField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    NEW = 'N'
    PENDING = 'P'
    DENIED = 'D'
    EXPIRED = 'E'
    APPROVED = 'A'
    CANCELED = 'C'
    TERMINATED = 'T'
    COMPLETED = 'O'
    STATUS_CHOICES = [
        (NEW, 'New'),
        (PENDING, 'Pending'),
        (EXPIRED, 'Expired'),
        (APPROVED, 'Approved'),
        (TERMINATED, 'Terminated'),
        (COMPLETED, 'Completed'),
    ]
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default=NEW)


class Request(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE)
    message = models.TextField()
    guest = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=(
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
        ('CANCELED', 'Canceled')
    ), default='PENDING')
