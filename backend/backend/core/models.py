from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Trip(models.Model):
    title = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    price = models.IntegerField()
    duration_days = models.IntegerField()
    description = models.TextField()
    itinerary = models.TextField(blank=True)
    image = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title





class Profile(models.Model):
    ROLE_CHOICES = (
        ("USER", "User"),
        ("ADMIN", "Admin"),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default="USER"
    )

    def __str__(self):
        return f"{self.user.username} - {self.role}"
