from rest_framework import serializers
from ..models import Enquiry

class AdminEnquirySerializer(serializers.ModelSerializer):
    trip_title = serializers.CharField(source="trip.title", read_only=True)

    class Meta:
        model = Enquiry
        fields = (
            "id",
            "trip_title",
            "name",
            "email",
            "phone",
            "message",
            "created_at",
        )
