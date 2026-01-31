from rest_framework import serializers
from ..models import Enquiry

class UserEnquirySerializer(serializers.ModelSerializer):
    trip_title = serializers.CharField(source="trip.title", read_only=True)

    class Meta:
        model = Enquiry
        fields = (
            "name",
            "id",
            "trip_title",
            "created_at",
            "message",
        )
