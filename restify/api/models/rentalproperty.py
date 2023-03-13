from django.db import models
from . import CustomUser
from multiselectfield import MultiSelectField
from multiselectfield.validators import MaxValueMultiFieldValidator


class RentalProperty(models.Model):
    owner = models.ForeignKey(CustomUser, on_delete = models.CASCADE)
    name = models.CharField(max_length = 255)
    address = models.CharField(max_length = 255)
    city = models.CharField(max_length = 255)
    country = models.CharField(max_length = 255)
    max_guests = models.PositiveIntegerField()
    beds = models.PositiveIntegerField()
    baths = models.PositiveIntegerField()
    description = models.TextField()
    AMENITIES_CHOICES = (
        ('wifi', 'WiFi'),
        ('tv', 'TV'), 
        ('kitchen', 'Kitchen'),
        ('air_conditioning', 'Air Conditioning'),
        ('pool', 'Pool'),
        ('gym', 'Gym'),
        ('parking', 'Parking'),
        ('balcony', 'Balcony'),
    )
    amenities = MultiSelectField(choices=AMENITIES_CHOICES, blank=True, validators=[MaxValueMultiFieldValidator(3)])

class PropertyImage(models.Model):
    property = models.ForeignKey(RentalProperty, on_delete = models.CASCADE, related_name = 'images')
    image = models.ImageField(upload_to = 'media/property/')


