from rest_framework import serializers
from ..models import Trip, InternationalSectionConfig




class InternationalTripSerializer(serializers.ModelSerializer):

    class Meta:
        model = Trip
        fields = [
            "id",
            "title",
            "country",
            "location",
            "price",
            "duration_days",
            "image",
            "display_order",
        ]


class InternationalSectionConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternationalSectionConfig
        fields = ["is_enabled", "title", "subtitle", "scroll_speed"]
