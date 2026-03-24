from rest_framework import serializers
from backend.backend.core.models import Trip, BikingSectionConfig # backend.backend.core.models

class BikingTripSerializer(serializers.ModelSerializer):
    """Optimized serializer for the Biking Trips section."""
    class Meta:
        model = Trip
        fields = [
            "id",
            "title",
            "location",
            "country",
            "state",
            "price",
            "duration_days",
            "duration_nights",
            "image",
            "short_description",
            "biking_display_order",
            "biking_featured_priority",
        ]

class BikingSectionConfigSerializer(serializers.ModelSerializer):
    """Serializer for the Biking Trips section configuration."""
    class Meta:
        model = BikingSectionConfig
        fields = ["is_enabled", "title", "subtitle", "scroll_speed"]
