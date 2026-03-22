from rest_framework import serializers
from ..models import Trip, HimachalSectionConfig

class HimachalTripSerializer(serializers.ModelSerializer):
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
            "himachal_display_order",
        ]

class HimachalSectionConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = HimachalSectionConfig
        fields = ["is_enabled", "title", "subtitle", "scroll_speed"]
