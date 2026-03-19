from rest_framework import serializers
from ..models import Trip, AdventureSectionConfig

class AdventureTripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = [
            "id",
            "title",
            "state",
            "location",
            "price",
            "duration_days",
            "image",
            "adventure_display_order",
        ]

class AdventureSectionConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdventureSectionConfig
        fields = ["is_enabled", "title", "subtitle", "scroll_speed"]
