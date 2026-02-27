from rest_framework import serializers
from ..models import Trip, HimalayanSectionConfig


class HimalayanTripSerializer(serializers.ModelSerializer):

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
            "himalayan_display_order",
        ]


class HimalayanSectionConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = HimalayanSectionConfig
        fields = ["is_enabled", "title", "subtitle", "scroll_speed"]
