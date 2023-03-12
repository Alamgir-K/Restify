from django.db import models
from . import User


def RentalProperty(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    max_guests = models.PositiveIntegerField()
    beds = models.PositiveIntegerField()
    baths = models.PositiveIntegerField()
    description = models.TextField()
    amenities = models.ArrayField(models.CharField(max_length=500))

class PropertyImage(models.Model):
    property = models.ForeignKey(RentalProperty, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='media/property/')

