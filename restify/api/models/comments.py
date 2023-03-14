from django.db import models
from django.contrib.auth.models import User
from reservation import Reservation
from django.core.validators import MaxValueValidator, MinValueValidator
from . import CustomUser

class UserRating(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='ratings_given')
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings_given')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], default=None)
    comment = models.TextField(default=None)
    created_at = models.DateTimeField(auto_now_add=True)

class CommentChain(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    host = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='comments')
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE, related_name='comments')
    created_at = models.DateTimeField(auto_now_add=True)
    Rating = models.IntegerField(default=None)
    comment = models.TextField()
    hostresponse = models.TextField(default=None)
    userresponse = models.TextField(default=None)

