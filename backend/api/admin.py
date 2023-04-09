from django.contrib import admin
from .models.user import CustomUser
from .models.rentalproperty import RentalProperty, PropertyImage
# Register your models here.
admin.site.register(CustomUser)
admin.site.register(RentalProperty)
admin.site.register(PropertyImage)

