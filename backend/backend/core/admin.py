from django.contrib import admin
from .models import Trip, Profile, Enquiry, SiteStat
# Register your models here.
admin.site.register(Trip)

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