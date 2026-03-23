from rest_framework import serializers
from ..models import Trip, LongWeekendSectionConfig

class LongWeekendTripSerializer(serializers.ModelSerializer):
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
            "long_weekend_display_order",
        ]


class LongWeekendSectionConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = LongWeekendSectionConfig
        fields = ["is_enabled", "title", "subtitle", "scroll_speed"]
