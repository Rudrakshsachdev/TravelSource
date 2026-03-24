from rest_framework import serializers
from ..models import Trip, MonsoonSectionConfig

class MonsoonTripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = [
            'id', 'title', 'location', 'image', 'price', 'duration_days',
            'monsoon_display_order', 'monsoon_featured_priority'
        ]

class MonsoonSectionConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonsoonSectionConfig
        fields = ['is_enabled', 'title', 'subtitle', 'scroll_speed']
