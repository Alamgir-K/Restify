from django.db import models

# Create your models here.


class User(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20)
    avatar = models.ImageField(upload_to='avatars/')
    password = models.CharField(max_length=128)
    is_host = models.BooleanField(default=False)
