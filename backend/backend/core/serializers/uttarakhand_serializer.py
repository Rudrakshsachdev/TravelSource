from rest_framework import serializers
from ..models import Trip, UttarakhandSectionConfig

class UttarakhandTripSerializer(serializers.ModelSerializer):
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
            "uttarakhand_display_order",
        ]

class UttarakhandSectionConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = UttarakhandSectionConfig
        fields = ["is_enabled", "title", "subtitle", "scroll_speed"]
