from rest_framework import serializers
from ..models import Trip, IndiaSectionConfig




class IndiaTripSerializer(serializers.ModelSerializer):
    

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
            "india_display_order",
        ]


class IndiaSectionConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndiaSectionConfig
        fields = ["is_enabled", "title", "subtitle", "scroll_speed"]
