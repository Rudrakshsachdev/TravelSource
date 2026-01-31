from django.contrib import admin
from .models import Trip, Profile, Enquiry
# Register your models here.
admin.site.register(Trip)

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "role")
    list_filter = ("role",)


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ("trip", "name", "email", "phone", "created_at")
    list_filter = ("created_at",)
    search_fields = ("name", "email", "phone")