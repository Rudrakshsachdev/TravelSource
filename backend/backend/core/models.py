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

    # International showcase fields
    country = models.CharField(max_length=100, blank=True, default="", help_text="Country name for international trips")
    short_description = models.CharField(max_length=300, blank=True, default="", help_text="Short tagline for card overlay")
    is_international = models.BooleanField(default=False, help_text="Mark as international trip")
    show_in_international_section = models.BooleanField(default=False, help_text="Show in the scrolling international section")
    display_order = models.IntegerField(default=0, help_text="Order in the international section (lower = first)")

    # India showcase fields
    state = models.CharField(max_length=100, blank=True, default="", help_text="State/Region for India trips")
    is_india_trip = models.BooleanField(default=False, help_text="Mark as India trip")
    show_in_india_section = models.BooleanField(default=False, help_text="Show in the scrolling India section")
    india_display_order = models.IntegerField(default=0, help_text="Order in the India section (lower = first)")
    india_featured_priority = models.IntegerField(default=0, help_text="Featured priority (higher = more prominent)")

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
    
    travel_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.trip.title} ({self.status})"


class InternationalSectionConfig(models.Model):
    """Singleton settings for the International Trips showcase section."""
    is_enabled = models.BooleanField(default=True, help_text="Enable the international trips scrolling section")
    title = models.CharField(max_length=200, default="Explore International Trips")
    subtitle = models.CharField(max_length=300, blank=True, default="", help_text="Optional subtitle below the heading")
    scroll_speed = models.PositiveIntegerField(default=60, help_text="Animation duration in seconds (higher = slower)")

    class Meta:
        verbose_name = "International Section Config"
        verbose_name_plural = "International Section Config"

    def __str__(self):
        return f"International Section ({'Enabled' if self.is_enabled else 'Disabled'})"

    def save(self, *args, **kwargs):
        # Enforce singleton: always use pk=1
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class IndiaSectionConfig(models.Model):
    """Singleton settings for the India Trips showcase section."""
    is_enabled = models.BooleanField(default=True, help_text="Enable the India trips scrolling section")
    title = models.CharField(max_length=200, default="Explore India Trips")
    subtitle = models.CharField(max_length=300, blank=True, default="", help_text="Optional subtitle below the heading")
    scroll_speed = models.PositiveIntegerField(default=60, help_text="Animation duration in seconds (higher = slower)")

    class Meta:
        verbose_name = "India Section Config"
        verbose_name_plural = "India Section Config"

    def __str__(self):
        return f"India Section ({'Enabled' if self.is_enabled else 'Disabled'})"

    def save(self, *args, **kwargs):
        # Enforce singleton: always use pk=1
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj
