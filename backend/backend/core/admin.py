from django.contrib import admin
from .models import Trip, Profile, Enquiry, SiteStat, InternationalSectionConfig
# Register your models here.


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = (
        "title", "location", "country", "price", "is_active",
        "is_international", "show_in_international_section", "display_order",
    )
    list_filter = ("is_active", "is_international", "show_in_international_section")
    list_editable = (
        "is_international", "show_in_international_section", "display_order",
    )
    search_fields = ("title", "location", "country")
    ordering = ("display_order", "-id")
    fieldsets = (
        (None, {
            "fields": ("title", "location", "country", "price", "duration_days", "image"),
        }),
        ("Details", {
            "fields": ("description", "short_description", "itinerary", "highlights", "inclusions", "exclusions"),
        }),
        ("International Showcase", {
            "fields": ("is_international", "show_in_international_section", "display_order"),
            "description": "Control how this trip appears in the International Trips scrolling section.",
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