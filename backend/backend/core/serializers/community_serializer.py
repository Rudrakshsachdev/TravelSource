from rest_framework import serializers
from ..models import Trip, CommunitySectionConfig

class CommunityTripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = ['id', 'title', 'location', 'image', 'price', 'duration_days', 'short_description', 'community_display_order']

class CommunitySectionConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunitySectionConfig
        fields = '__all__'
