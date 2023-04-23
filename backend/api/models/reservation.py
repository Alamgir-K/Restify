from django.db import models
from .user import CustomUser
from . import RentalProperty
from multiselectfield.validators import MaxValueMultiFieldValidator
from django.core.validators import MinValueValidator


class Reservation(models.Model):
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='reservations', default=None)
    property = models.ForeignKey(
        RentalProperty, on_delete=models.CASCADE, related_name='reservations')
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    message = models.TextField(default=None, blank=True, null=True)
    guest = models.IntegerField()
    total_cost = models.FloatField(validators=[MinValueValidator(0.0)])
    PENDING = 'P'
    DENIED = 'D'
    APPROVED = 'A'
    CANCELED = 'C'
    TERMINATED = 'T'
    COMPLETED = 'O'
    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (DENIED, 'Denied'),
        (APPROVED, 'Approved'),
        (COMPLETED, 'Completed'),
        (CANCELED, "Cancelled"),
        (TERMINATED, 'Terminated'),
    ]
    status = models.CharField(
        max_length=1, choices=STATUS_CHOICES, default=PENDING)
