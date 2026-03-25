from rest_framework import serializers
from ..models import Trip, GirlsSectionConfig

class GirlsTripSerializer(serializers.ModelSerializer):
    """Minimal serializer for the scrolling showcase cards."""
    class Meta:
        model = Trip
        fields = (
            "id", "title", "location", "price", "image",
            "duration_days", "duration_nights",
            "girls_display_order", "girls_featured_priority",
            "short_description"
        )

class GirlsSectionConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = GirlsSectionConfig
        fields = "__all__"
