from django.db import models
from django.contrib.auth.models import User
from reservation import Reservation
from django.core.validators import MaxValueValidator, MinValueValidator

class ReservationComment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE, related_name='comments')
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    Rating = models.IntegerField(default=None)


class ReviewResponse(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    review = models.ForeignKey(ReservationComment, on_delete=models.CASCADE)
    text = models.TextField()


class UserRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings_given')
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings_given')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], default=None)
    comment = models.TextField(default=None)
    created_at = models.DateTimeField(auto_now_add=True)
