from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User

from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.


class CustomUser(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="custom_user")
    phone_number = models.CharField(max_length=20)
    avatar = models.ImageField(upload_to='avatars/', blank=True)
    is_host = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.user.username


def create_custom_user(sender, instance, created, **kwargs):
    if created:
        profile, created = CustomUser.objects.get_or_create(user=instance)


post_save.connect(create_custom_user, sender=User)
