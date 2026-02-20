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
    

class TripView(models.Model):
    """Tracks which trips a logged-in user has viewed, used for recommendations."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="trip_views")
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="views")
    viewed_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "trip")
        ordering = ["-viewed_at"]

    def __str__(self):
        return f"{self.user.username} viewed {self.trip.title}"


class Review(models.Model):
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default="India")
    trip = models.CharField(max_length=200)
    rating = models.PositiveSmallIntegerField(default=5)
    review = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.trip} ({self.rating}★)"


class SiteStat(models.Model):
    """Key-value stats editable from Django admin (e.g. trips_completed)."""
    key = models.CharField(max_length=80, unique=True, help_text="Stat identifier, e.g. trips_completed")
    label = models.CharField(max_length=120, help_text="Display label shown on frontend")
    value = models.PositiveIntegerField(default=0)
    icon = models.CharField(max_length=10, blank=True, default="📊", help_text="Emoji icon for display")

    class Meta:
        verbose_name = "Site Stat"
        verbose_name_plural = "Site Stats"

    def __str__(self):
        return f"{self.label}: {self.value}"


class Booking(models.Model):
    STATUS_CHOICES = (
    ("PENDING", "Pending"),
    ("APPROVED", "Approved"),
    ("DECLINED", "Declined"),
    )


    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="bookings"
    )
    trip = models.ForeignKey(
        Trip,
        on_delete=models.CASCADE,
        related_name="bookings"
    )

    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)

    persons = models.PositiveIntegerField(default=1)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )

    admin_note = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.trip.title} ({self.status})"
