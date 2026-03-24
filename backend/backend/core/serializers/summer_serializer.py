from rest_framework import serializers
from ..models import Trip, SummerSectionConfig

class SummerTripSerializer(serializers.ModelSerializer):
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
            "image",
            "short_description",
            "summer_display_order",
            "summer_featured_priority",
        ]

class SummerSectionConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = SummerSectionConfig
        fields = ["is_enabled", "title", "subtitle", "scroll_speed"]
