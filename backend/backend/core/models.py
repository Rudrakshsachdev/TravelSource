from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Trip(models.Model):
    title = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    price = models.IntegerField()
    duration_days = models.IntegerField()
    description = models.TextField(blank=True)
    itinerary = models.JSONField(blank=True, null=True, help_text="List of daily itinerary objects")
    highlights = models.JSONField(blank=True, null=True, help_text="List of trip highlights")
    inclusions = models.JSONField(blank=True, null=True, help_text="List of included items")
    exclusions = models.JSONField(blank=True, null=True, help_text="List of excluded items")
    image = models.URLField(blank=True, default="")
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



class Enquiry(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="enquiries")
    user = models.ForeignKey(
        "auth.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Enquiry for {self.trip.title} by {self.name}"



class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.email}"