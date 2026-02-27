from rest_framework import serializers
from ..models import Trip, HoneymoonSectionConfig


class HoneymoonTripSerializer(serializers.ModelSerializer):

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
            "honeymoon_display_order",
        ]


class HoneymoonSectionConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = HoneymoonSectionConfig
        fields = ["is_enabled", "title", "subtitle", "scroll_speed"]
