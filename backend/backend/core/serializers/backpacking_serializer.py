from rest_framework import serializers
from ..models import Trip, BackpackingSectionConfig

class BackpackingTripSerializer(serializers.ModelSerializer):
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
            "backpacking_display_order",
            "backpacking_featured_priority",
        ]


class BackpackingSectionConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = BackpackingSectionConfig
        fields = ["is_enabled", "title", "subtitle", "scroll_speed"]
