from rest_framework import serializers
from ..models import Trip, FestivalSectionConfig, Category

class FestivalCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'emoji']

class FestivalTripSerializer(serializers.ModelSerializer):
    category = FestivalCategorySerializer(read_only=True)
    
    class Meta:
        model = Trip
        fields = [
            'id', 'title', 'location', 'price', 'duration_days', 
            'short_description', 'image', 'category',
            'is_festival_trip', 'show_in_festival_section', 'festival_display_order', 'festival_featured_priority'
        ]

class FestivalSectionConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = FestivalSectionConfig
        fields = ['is_enabled', 'title', 'subtitle', 'scroll_speed']
