from django.db import models
from . import CustomUser
from multiselectfield import MultiSelectField
from multiselectfield.validators import MaxValueMultiFieldValidator
from django.core.validators import MinValueValidator


class RentalProperty(models.Model):
    owner = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='properties')
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    price = models.FloatField(validators=[MinValueValidator(0.0)])
    max_guests = models.PositiveIntegerField()
    beds = models.PositiveIntegerField()
    baths = models.PositiveIntegerField()
    main_image = models.ImageField(upload_to='property')
    img1 = models.ImageField(upload_to='property', blank=True, null=True)
    img2 = models.ImageField(upload_to='property', blank=True, null=True)
    img3 = models.ImageField(upload_to='property', blank=True, null=True)
    img4 = models.ImageField(upload_to='property', blank=True, null=True)
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
    amenities = MultiSelectField(choices=AMENITIES_CHOICES, blank=True, validators=[
                                 MaxValueMultiFieldValidator(8)])


# class PropertyImage(models.Model):
#     property = models.ForeignKey(
#         RentalProperty, on_delete=models.CASCADE, related_name='images')
#     image = models.ImageField(upload_to='property')
