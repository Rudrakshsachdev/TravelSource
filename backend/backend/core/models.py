from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Category(models.Model):
    """Trip categories managed from the admin panel."""
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    image = models.URLField(blank=True, default="")
    emoji = models.CharField(max_length=10, blank=True, default="")
    grad_start = models.CharField(max_length=20, blank=True, default="#3f9e8f", help_text="Gradient start colour hex")
    grad_end = models.CharField(max_length=20, blank=True, default="#2ecc71", help_text="Gradient end colour hex")

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["id"]

    def __str__(self):
        return self.name


class Trip(models.Model):
    title = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    price = models.IntegerField()
    duration_days = models.IntegerField()
    duration_nights = models.IntegerField(default=0)
    description = models.TextField(blank=True)
    itinerary = models.JSONField(blank=True, null=True, help_text="List of daily itinerary objects")
    highlights = models.JSONField(blank=True, null=True, help_text="List of trip highlights")
    inclusions = models.JSONField(blank=True, null=True, help_text="List of included items")
    exclusions = models.JSONField(blank=True, null=True, help_text="List of excluded items")
    image = models.URLField(blank=True, default="")
    is_active = models.BooleanField(default=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="trips")

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

    # Himachal showcase fields
    is_himachal_trip = models.BooleanField(default=False, help_text="Mark as Himachal trip")
    show_in_himachal_section = models.BooleanField(default=False, help_text="Show in the scrolling Himachal section")
    himachal_display_order = models.IntegerField(default=0, help_text="Order in the Himachal section (lower = first)")
    himachal_featured_priority = models.IntegerField(default=0, help_text="Featured priority (higher = more prominent)")

    # Uttarakhand showcase fields
    is_uttarakhand_trip = models.BooleanField(default=False, help_text="Mark as Uttarakhand trip")
    show_in_uttarakhand_section = models.BooleanField(default=False, help_text="Show in the scrolling Uttarakhand section")
    uttarakhand_display_order = models.IntegerField(default=0, help_text="Order in the Uttarakhand section (lower = first)")
    uttarakhand_featured_priority = models.IntegerField(default=0, help_text="Featured priority (higher = more prominent)")

    # North India showcase fields
    is_north_india_trip = models.BooleanField(default=False, help_text="Mark as North India trip")
    show_in_north_india_section = models.BooleanField(default=False, help_text="Show in the scrolling North India section")
    north_india_display_order = models.IntegerField(default=0, help_text="Order in the North India section (lower = first)")
    north_india_featured_priority = models.IntegerField(default=0, help_text="Featured priority (higher = more prominent)")

    # Honeymoon showcase fields
    is_honeymoon = models.BooleanField(default=False, help_text="Mark as honeymoon trip")
    show_in_honeymoon_section = models.BooleanField(default=False, help_text="Show in the scrolling honeymoon section")
    honeymoon_display_order = models.IntegerField(default=0, help_text="Order in the honeymoon section (lower = first)")

    # Himalayan showcase fields
    is_himalayan_trek = models.BooleanField(default=False, help_text="Mark as Himalayan trek")
    show_in_himalayan_section = models.BooleanField(default=False, help_text="Show in the scrolling Himalayan section")
    himalayan_display_order = models.IntegerField(default=0, help_text="Order in the Himalayan section (lower = first)")

    # Backpacking showcase fields
    is_backpacking_trip = models.BooleanField(default=False, help_text="Mark as Backpacking trip")
    show_in_backpacking_section = models.BooleanField(default=False, help_text="Show in the scrolling Backpacking section")
    backpacking_display_order = models.IntegerField(default=0, help_text="Order in the Backpacking section (lower = first)")

    is_summer_trek = models.BooleanField(default=False, help_text="Mark as Summer trek")
    show_in_summer_section = models.BooleanField(default=False, help_text="Show in the scrolling Summer section")
    summer_display_order = models.IntegerField(default=0, help_text="Order in the Summer section (lower = first)")

    is_monsoon_trek = models.BooleanField(default=False, help_text="Mark as Monsoon trek")
    show_in_monsoon_section = models.BooleanField(default=False, help_text="Show in the scrolling Monsoon section")
    monsoon_display_order = models.IntegerField(default=0, help_text="Order in the Monsoon section (lower = first)")

    is_community_trip = models.BooleanField(default=False, help_text="Mark as Community trip")
    show_in_community_section = models.BooleanField(default=False, help_text="Show in the scrolling Community section")
    community_display_order = models.IntegerField(default=0, help_text="Order in the Community section (lower = first)")

    is_festival_trip = models.BooleanField(default=False, help_text="Mark as Festival trip")
    show_in_festival_section = models.BooleanField(default=False, help_text="Show in the scrolling Festival section")
    festival_display_order = models.IntegerField(default=0, help_text="Order in the Festival section (lower = first)")

    # Adventure showcase fields
    is_adventure_trip = models.BooleanField(default=False, help_text="Mark as Adventure trip")
    show_in_adventure_section = models.BooleanField(default=False, help_text="Show in the scrolling Adventure section")
    adventure_display_order = models.IntegerField(default=0, help_text="Order in the Adventure section (lower = first)")

    # Good Friday showcase fields
    is_good_friday_trip = models.BooleanField(default=False, help_text="Mark as Good Friday trip")
    show_in_good_friday_section = models.BooleanField(default=False, help_text="Show in the scrolling Good Friday section")
    good_friday_display_order = models.IntegerField(default=0, help_text="Order in the Good Friday section (lower = first)")

    # Long Weekend showcase fields
    is_long_weekend_trip = models.BooleanField(default=False, help_text="Mark as Long Weekend trip")
    show_in_long_weekend_section = models.BooleanField(default=False, help_text="Show in the scrolling Long Weekend section")
    long_weekend_display_order = models.IntegerField(default=0, help_text="Order in the Long Weekend section (lower = first)")
    long_weekend_featured_priority = models.IntegerField(default=0, help_text="Featured priority (higher = more prominent)")

    # Featured trip showcase
    is_featured = models.BooleanField(default=False, help_text="Mark as featured trip (shows in Featured Destination section)")
    featured_highlights = models.JSONField(blank=True, null=True, help_text="List of highlight labels for floating chips, e.g. [\"Ubud · Rice Terraces\", \"Tanah Lot · Temples\"]")

    # Journey in Frames showcase
    show_in_journey_in_frames = models.BooleanField(default=False, help_text="Show in the Journey in Frames gallery section")
    journey_in_frames_order = models.IntegerField(default=0, help_text="Order in the Journey in Frames section (lower = first)")

    # ── Trip Detail Page (JustWravel-style) ──
    gallery_image_urls = models.JSONField(blank=True, null=True, help_text="List of Cloudinary image URLs for the photo gallery")
    batches = models.JSONField(blank=True, null=True, help_text='List of batch objects, e.g. [{"startDate": "...", "endDate": "...", "status": "Available/Filling Fast/Full"}]')
    price_options = models.JSONField(blank=True, null=True, help_text='List of pricing options, e.g. [{"occupancy": "Triple", "price": 10000}, {"occupancy": "Double", "price": 12000}]')
    overview = models.TextField(blank=True, default="", help_text="Rich overview / about text for the trip detail page")
    cancellation_policy = models.TextField(blank=True, default="", help_text="Cancellation policy text")
    things_to_pack = models.JSONField(blank=True, null=True, help_text='List of packing items, e.g. ["Warm jacket", "Trekking shoes"]')
    faqs = models.JSONField(blank=True, null=True, help_text='List of FAQ objects, e.g. [{"q": "...", "a": "..."}]')
    pickup_location = models.CharField(max_length=100, blank=True, default="", help_text="Pickup city, e.g. Delhi")
    drop_location = models.CharField(max_length=100, blank=True, default="", help_text="Drop city, e.g. Delhi")


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

    itinerary = models.CharField(max_length=200, blank=True, default="")
    batch_details = models.CharField(max_length=200, blank=True, default="")
    occupancy_details = models.CharField(max_length=200, blank=True, default="")

    travel_date = models.DateField(null=True, blank=True)
    coupon_code = models.CharField(max_length=50, blank=True, null=True, help_text="Coupon code applied during booking")
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text="Discount amount applied")
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


class NorthIndiaSectionConfig(models.Model):
    """Singleton settings for the North India Trips showcase section."""
    is_enabled = models.BooleanField(default=True, help_text="Enable the North India trips scrolling section")
    title = models.CharField(max_length=200, default="Explore North India Trips")
    subtitle = models.CharField(max_length=300, blank=True, default="", help_text="Optional subtitle below the heading")
    scroll_speed = models.PositiveIntegerField(default=60, help_text="Animation duration in seconds (higher = slower)")

    class Meta:
        verbose_name = "North India Section Config"
        verbose_name_plural = "North India Section Config"

    def __str__(self):
        return f"North India Section ({'Enabled' if self.is_enabled else 'Disabled'})"

    def save(self, *args, **kwargs):
        # Enforce singleton: always use pk=1
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class HoneymoonSectionConfig(models.Model):
    """Singleton settings for the Honeymoon Trips showcase section."""
    is_enabled = models.BooleanField(default=True, help_text="Enable the honeymoon trips scrolling section")
    title = models.CharField(max_length=200, default="Honeymoon Getaways")
    subtitle = models.CharField(max_length=300, blank=True, default="", help_text="Optional subtitle below the heading")
    scroll_speed = models.PositiveIntegerField(default=60, help_text="Animation duration in seconds (higher = slower)")

    class Meta:
        verbose_name = "Honeymoon Section Config"
        verbose_name_plural = "Honeymoon Section Config"

    def __str__(self):
        return f"Honeymoon Section ({'Enabled' if self.is_enabled else 'Disabled'})"

    def save(self, *args, **kwargs):
        # Enforce singleton: always use pk=1
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class HimalayanSectionConfig(models.Model):
    """Singleton settings for the Himalayan Treks showcase section."""
    is_enabled = models.BooleanField(default=True, help_text="Enable the Himalayan treks scrolling section")
    title = models.CharField(max_length=200, default="Majestic Himalayan Treks")
    subtitle = models.CharField(max_length=300, blank=True, default="", help_text="Optional subtitle below the heading")
    scroll_speed = models.PositiveIntegerField(default=60, help_text="Animation duration in seconds (higher = slower)")

    class Meta:
        verbose_name = "Himalayan Section Config"
        verbose_name_plural = "Himalayan Section Config"

    def __str__(self):
        return f"Himalayan Section ({'Enabled' if self.is_enabled else 'Disabled'})"

    def save(self, *args, **kwargs):
        # Enforce singleton: always use pk=1
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class BackpackingSectionConfig(models.Model):
    """Singleton settings for the Backpacking Trips showcase section."""
    is_enabled = models.BooleanField(default=True, help_text="Enable the Backpacking trips scrolling section")
    title = models.CharField(max_length=200, default="Adventure Backpacking")
    subtitle = models.CharField(max_length=300, blank=True, default="", help_text="Optional subtitle below the heading")
    scroll_speed = models.PositiveIntegerField(default=60, help_text="Animation duration in seconds (higher = slower)")

    class Meta:
        verbose_name = "Backpacking Section Config"
        verbose_name_plural = "Backpacking Section Config"

    def __str__(self):
        return f"Backpacking Section ({'Enabled' if self.is_enabled else 'Disabled'})"

    def save(self, *args, **kwargs):
        # Enforce singleton: always use pk=1
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class SummerSectionConfig(models.Model):
    """Singleton settings for the Summer Treks showcase section."""
    is_enabled = models.BooleanField(default=True, help_text="Enable the Summer treks scrolling section")
    title = models.CharField(max_length=200, default="Vibrant Summer Treks")
    subtitle = models.CharField(max_length=300, blank=True, default="", help_text="Optional subtitle below the heading")
    scroll_speed = models.PositiveIntegerField(default=60, help_text="Animation duration in seconds (higher = slower)")

    class Meta:
        verbose_name = "Summer Section Config"
        verbose_name_plural = "Summer Section Config"

    def __str__(self):
        return f"Summer Section ({'Enabled' if self.is_enabled else 'Disabled'})"

    def save(self, *args, **kwargs):
        # Enforce singleton: always use pk=1
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class MonsoonSectionConfig(models.Model):
    """Singleton settings for the Monsoon Treks showcase section."""
    is_enabled = models.BooleanField(default=True, help_text="Enable the Monsoon treks scrolling section")
    title = models.CharField(max_length=200, default="Misty Monsoon Treks")
    subtitle = models.CharField(max_length=300, blank=True, default="", help_text="Optional subtitle below the heading")
    scroll_speed = models.PositiveIntegerField(default=60, help_text="Animation duration in seconds (higher = slower)")

    class Meta:
        verbose_name = "Monsoon Section Config"
        verbose_name_plural = "Monsoon Section Config"

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class CommunitySectionConfig(models.Model):
    """Singleton settings for the Community Trips showcase section."""
    is_enabled = models.BooleanField(default=True, help_text="Enable the Community trips scrolling section")
    title = models.CharField(max_length=200, default="Social Community Trips")
    subtitle = models.CharField(max_length=300, blank=True, default="", help_text="Optional subtitle below the heading")
    scroll_speed = models.PositiveIntegerField(default=60, help_text="Animation duration in seconds (higher = slower)")

    class Meta:
        verbose_name = "Community Section Config"
        verbose_name_plural = "Community Section Config"

    def __str__(self):
        return f"Community Section ({'Enabled' if self.is_enabled else 'Disabled'})"

    def save(self, *args, **kwargs):
        # Enforce singleton: always use pk=1
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj





class FestivalSectionConfig(models.Model):
    """Singleton settings for the Festival Trips showcase section."""
    is_enabled = models.BooleanField(default=True, help_text="Enable the Festival trips scrolling section")
    title = models.CharField(max_length=200, default="Celebrate Festival Trips")
    subtitle = models.CharField(max_length=300, blank=True, default="", help_text="Optional subtitle below the heading")
    scroll_speed = models.PositiveIntegerField(default=60, help_text="Animation duration in seconds (higher = slower)")

    class Meta:
        verbose_name = "Festival Section Config"
        verbose_name_plural = "Festival Section Config"

    def __str__(self):
        return f"Festival Section ({'Enabled' if self.is_enabled else 'Disabled'})"

    def save(self, *args, **kwargs):
        # Enforce singleton: always use pk=1
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class AdventureSectionConfig(models.Model):
    """Singleton settings for the Adventure Trips showcase section."""
    is_enabled = models.BooleanField(default=True, help_text="Enable the Adventure trips scrolling section")
    title = models.CharField(max_length=200, default="Epic Adventure Trips")
    subtitle = models.CharField(max_length=300, blank=True, default="", help_text="Optional subtitle below the heading")
    scroll_speed = models.PositiveIntegerField(default=60, help_text="Animation duration in seconds (higher = slower)")

    class Meta:
        verbose_name = "Adventure Section Config"
        verbose_name_plural = "Adventure Section Config"

    def __str__(self):
        return f"Adventure Section ({'Enabled' if self.is_enabled else 'Disabled'})"

    def save(self, *args, **kwargs):
        # Enforce singleton: always use pk=1
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class PasswordResetOTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"OTP for {self.email} - {self.otp}"


class TripGalleryImage(models.Model):
    """Multiple images per trip for the gallery collage section."""
    IMAGE_TYPE_CHOICES = (
        ("GALLERY", "Gallery"),
        ("MAP", "Route Map"),
        ("REVIEW", "Review Screenshot"),
    )
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="gallery_images")
    image = models.URLField(help_text="Cloudinary image URL")
    caption = models.CharField(max_length=200, blank=True, default="")
    image_type = models.CharField(max_length=20, choices=IMAGE_TYPE_CHOICES, default="GALLERY")
    display_order = models.IntegerField(default=0, help_text="Lower = displayed first")

    class Meta:
        ordering = ["display_order", "id"]
        verbose_name = "Trip Gallery Image"
        verbose_name_plural = "Trip Gallery Images"

    def __str__(self):
        return f"{self.trip.title} — {self.get_image_type_display()} #{self.display_order}"


class HimachalSectionConfig(models.Model):
    """Singleton settings for the Himachal Trips showcase section."""
    is_enabled = models.BooleanField(default=True, help_text="Enable the Himachal trips scrolling section")
    title = models.CharField(max_length=200, default="Explore Himachal Pradesh")
    subtitle = models.CharField(max_length=300, blank=True, default="", help_text="Optional subtitle below the heading")
    scroll_speed = models.PositiveIntegerField(default=60, help_text="Animation duration in seconds (higher = slower)")

    class Meta:
        verbose_name = "Himachal Section Config"
        verbose_name_plural = "Himachal Section Config"

    def __str__(self):
        return f"Himachal Section ({'Enabled' if self.is_enabled else 'Disabled'})"

    def save(self, *args, **kwargs):
        # Enforce singleton: always use pk=1
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class UttarakhandSectionConfig(models.Model):
    """Singleton settings for the Uttarakhand Trips showcase section."""
    is_enabled = models.BooleanField(default=True, help_text="Enable the Uttarakhand trips scrolling section")
    title = models.CharField(max_length=200, default="Explore Uttarakhand")
    subtitle = models.CharField(max_length=300, blank=True, default="", help_text="Optional subtitle below the heading")
    scroll_speed = models.PositiveIntegerField(default=60, help_text="Animation duration in seconds (higher = slower)")

    class Meta:
        verbose_name = "Uttarakhand Section Config"
        verbose_name_plural = "Uttarakhand Section Config"

    def __str__(self):
        return f"Uttarakhand Section ({'Enabled' if self.is_enabled else 'Disabled'})"

    def save(self, *args, **kwargs):
        # Enforce singleton: always use pk=1
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class LongWeekendSectionConfig(models.Model):
    """Singleton settings for the Long Weekend Trips showcase section."""
    is_enabled = models.BooleanField(default=True, help_text="Enable the Long Weekend trips scrolling section")
    title = models.CharField(max_length=200, default="Long Weekend Gateways")
    subtitle = models.CharField(max_length=300, blank=True, default="", help_text="Optional subtitle below the heading")
    scroll_speed = models.PositiveIntegerField(default=60, help_text="Animation duration in seconds (higher = slower)")

    class Meta:
        verbose_name = "Long Weekend Section Config"
        verbose_name_plural = "Long Weekend Section Config"

    def __str__(self):
        return f"Long Weekend Section ({'Enabled' if self.is_enabled else 'Disabled'})"

    def save(self, *args, **kwargs):
        # Enforce singleton: always use pk=1
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class Coupon(models.Model):
    DISCOUNT_TYPES = (
        ('PERCENTAGE', 'Percentage'),
        ('FLAT', 'Flat Amount'),
    )

    code = models.CharField(max_length=50, unique=True, help_text="Unique coupon code (e.g. SUMMER20)")
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPES, default='PERCENTAGE')
    discount_value = models.DecimalField(max_digits=10, decimal_places=2, help_text="Percentage or Flat amount")
    max_discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Max discount cap for percentage coupons")
    min_booking_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text="Minimum booking total required to apply coupon")
    
    is_active = models.BooleanField(default=True, help_text="Toggle to enable/disable the coupon")
    expiry_date = models.DateTimeField(null=True, blank=True, help_text="Coupon expiration date")
    
    usage_limit = models.PositiveIntegerField(default=0, help_text="Max times coupon can be used overall (0 = unlimited)")
    times_used = models.PositiveIntegerField(default=0, help_text="Counter for successful uses")
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name="coupons", help_text="Restrict to specific user (optional)")
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, null=True, blank=True, related_name="coupons", help_text="Restrict to specific trip (optional)")
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.code} - {self.discount_value}{'%' if self.discount_type == 'PERCENTAGE' else ' INR'}"
