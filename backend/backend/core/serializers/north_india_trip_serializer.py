from rest_framework import serializers
from ..models import Trip, NorthIndiaSectionConfig


class NorthIndiaTripSerializer(serializers.ModelSerializer):
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
            "north_india_display_order",
        ]


class NorthIndiaSectionConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = NorthIndiaSectionConfig
        fields = ["is_enabled", "title", "subtitle", "scroll_speed"]
