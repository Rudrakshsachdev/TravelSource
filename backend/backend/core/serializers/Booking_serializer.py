from ..models import Booking
from rest_framework import serializers
from .serializers import TripSerializer


class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = "__all__"
        read_only_fields = ["user", "status", "total_amount", "created_at"]


class BookingListSerializer(serializers.ModelSerializer):
    trip = TripSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = "__all__"
