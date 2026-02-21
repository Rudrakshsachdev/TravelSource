"""
This TripSerializer is a Django REST Framework ModelSerializer used to convert Trip model instances into JSON format and to validate incoming data before creating or updating records in the database. By extending ModelSerializer, it automatically maps model fields to serializer fields, reducing the need for manual definitions. The Meta class specifies the Trip model as the source and explicitly defines the fields that should be exposed through the API, including the unique identifier, trip title, location, duration in days, price, detailed description, and active status. This approach ensures that only the required and relevant model attributes are serialized, providing a clean and controlled API response while also enabling built-in validation based on the model’s field constraints.
"""
from rest_framework import serializers
from ..models import Trip

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = [
            "id",
            "title",
            "location",
            "duration_days",
            "price",
            "description",
            "itinerary",
            "highlights",
            "inclusions",
            "exclusions",
            "image",
            "is_active",
            "country",
            "short_description",
            "is_international",
            "show_in_international_section",
            "display_order",
        ]
