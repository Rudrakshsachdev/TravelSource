from django.contrib import admin
from .models import Trip, Profile, Enquiry, SiteStat, InternationalSectionConfig, IndiaSectionConfig, HoneymoonSectionConfig, HimalayanSectionConfig, BackpackingSectionConfig, SummerSectionConfig, MonsoonSectionConfig, Category
# Register your models here.


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "emoji")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = (
        "title", "location", "country", "state", "category", "price", "is_active",
        "is_international", "show_in_international_section", "display_order",
        "is_india_trip", "show_in_india_section", "india_display_order",
        "is_honeymoon", "show_in_honeymoon_section", "honeymoon_display_order",
        "is_himalayan_trek", "show_in_himalayan_section", "himalayan_display_order",
        "is_backpacking_trip", "show_in_backpacking_section", "backpacking_display_order",
        "is_summer_trek", "show_in_summer_section", "summer_display_order",
    )
    list_filter = ("is_active", "category", "is_international", "show_in_international_section", "is_india_trip", "show_in_india_section")
    list_editable = (
        "is_international", "show_in_international_section", "display_order",
        "is_india_trip", "show_in_india_section", "india_display_order",
        "is_honeymoon", "show_in_honeymoon_section", "honeymoon_display_order",
        "is_himalayan_trek", "show_in_himalayan_section", "himalayan_display_order",
        "is_backpacking_trip", "show_in_backpacking_section", "backpacking_display_order",
        "is_summer_trek", "show_in_summer_section", "summer_display_order",
    )
    search_fields = ("title", "location", "country", "state")
    ordering = ("display_order", "-id")
    fieldsets = (
        (None, {
            "fields": ("title", "location", "country", "state", "category", "price", "duration_days", "image"),
        }),
        ("Details", {
            "fields": ("description", "short_description", "itinerary", "highlights", "inclusions", "exclusions"),
        }),
        ("International Showcase", {
            "fields": ("is_international", "show_in_international_section", "display_order"),
            "description": "Control how this trip appears in the International Trips scrolling section.",
        }),
        ("India Showcase", {
            "fields": ("is_india_trip", "show_in_india_section", "india_display_order", "india_featured_priority"),
            "description": "Control how this trip appears in the India Trips scrolling section.",
        }),
        ("Honeymoon Showcase", {
            "fields": ("is_honeymoon", "show_in_honeymoon_section", "honeymoon_display_order"),
            "description": "Control how this trip appears in the Honeymoon Trips scrolling section.",
        }),
        ("Himalayan Showcase", {
            "fields": ("is_himalayan_trek", "show_in_himalayan_section", "himalayan_display_order"),
            "description": "Control how this trip appears in the Himalayan Treks scrolling section.",
        }),
        ("Backpacking Showcase", {
            "fields": ("is_backpacking_trip", "show_in_backpacking_section", "backpacking_display_order"),
            "description": "Control how this trip appears in the Backpacking Trips scrolling section.",
        }),
        ("Summer Showcase", {
            "fields": ("is_summer_trek", "show_in_summer_section", "summer_display_order"),
            "description": "Control how this trip appears in the Summer Treks scrolling section.",
        }),
        ("Monsoon Showcase", {
            "fields": ("is_monsoon_trek", "show_in_monsoon_section", "monsoon_display_order"),
            "description": "Control how this trip appears in the Monsoon Treks scrolling section.",
        }),

        ("Status", {
            "fields": ("is_active",),
        }),
    )


@admin.register(InternationalSectionConfig)
class InternationalSectionConfigAdmin(admin.ModelAdmin):
    list_display = ("title", "is_enabled", "scroll_speed")
    list_editable = ("is_enabled", "scroll_speed")

    def has_add_permission(self, request):
        # Only allow one instance (singleton)
        return not InternationalSectionConfig.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(IndiaSectionConfig)
class IndiaSectionConfigAdmin(admin.ModelAdmin):
    list_display = ("title", "is_enabled", "scroll_speed")
    list_editable = ("is_enabled", "scroll_speed")

    def has_add_permission(self, request):
        # Only allow one instance (singleton)
        return not IndiaSectionConfig.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

@admin.register(HoneymoonSectionConfig)
class HoneymoonSectionConfigAdmin(admin.ModelAdmin):
    list_display = ("title", "is_enabled", "scroll_speed")
    list_editable = ("is_enabled", "scroll_speed")

    def has_add_permission(self, request):
        return not HoneymoonSectionConfig.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

@admin.register(HimalayanSectionConfig)
class HimalayanSectionConfigAdmin(admin.ModelAdmin):
    list_display = ("title", "is_enabled", "scroll_speed")
    list_editable = ("is_enabled", "scroll_speed")

    def has_add_permission(self, request):
        return not HimalayanSectionConfig.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(BackpackingSectionConfig)
class BackpackingSectionConfigAdmin(admin.ModelAdmin):
    list_display = ("title", "is_enabled", "scroll_speed")
    list_editable = ("is_enabled", "scroll_speed")

    def has_add_permission(self, request):
        return not BackpackingSectionConfig.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

@admin.register(SummerSectionConfig)
class SummerSectionConfigAdmin(admin.ModelAdmin):
    list_display = ("title", "is_enabled", "scroll_speed")
    list_editable = ("is_enabled", "scroll_speed")

    def has_add_permission(self, request):
        return not SummerSectionConfig.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(MonsoonSectionConfig)
class MonsoonSectionConfigAdmin(admin.ModelAdmin):
    list_display = ("title", "is_enabled", "scroll_speed")
    list_editable = ("is_enabled", "scroll_speed")

    def has_add_permission(self, request):
        return not MonsoonSectionConfig.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(SiteStat)
class SiteStatAdmin(admin.ModelAdmin):
    list_display = ("key", "label", "value", "icon")
    list_editable = ("value",)
    search_fields = ("key", "label")

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "role")
    list_filter = ("role",)


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ("trip", "name", "email", "phone", "created_at")
    list_filter = ("created_at",)
    search_fields = ("name", "email", "phone")