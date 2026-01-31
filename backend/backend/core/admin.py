from django.contrib import admin
from .models import Trip, Profile
# Register your models here.
admin.site.register(Trip)

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "role")
    list_filter = ("role",)
