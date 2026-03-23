from rest_framework import serializers
from core.models import TripGalleryImage

class TripGalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripGalleryImage
        fields = '__all__'
