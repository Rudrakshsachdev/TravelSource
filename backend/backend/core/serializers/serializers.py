"""
This TripSerializer is a Django REST Framework ModelSerializer used to convert Trip model instances into JSON format and to validate incoming data before creating or updating records in the database. By extending ModelSerializer, it automatically maps model fields to serializer fields, reducing the need for manual definitions. The Meta class specifies the Trip model as the source and explicitly defines the fields that should be exposed through the API, including the unique identifier, trip title, location, duration in days, price, detailed description, and active status. This approach ensures that only the required and relevant model attributes are serialized, providing a clean and controlled API response while also enabling built-in validation based on the model's field constraints.
"""
from rest_framework import serializers
from ..models import Trip, Category
from .category_serializer import CategorySerializer


class TripSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Trip
        fields = [
            "id",
            "title",
            "location",
            "state",
            "duration_days",
            "duration_nights",
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
            "is_india_trip",
            "show_in_india_section",
            "is_north_india_trip",
            "show_in_north_india_section",
            "north_india_display_order",
            "north_india_featured_priority",
            "is_himachal_trip",
            "show_in_himachal_section",
            "himachal_display_order",
            "himachal_featured_priority",
            "is_uttarakhand_trip",
            "show_in_uttarakhand_section",
            "uttarakhand_display_order",
            "uttarakhand_featured_priority",
            "is_honeymoon",
            "show_in_honeymoon_section",
            "is_himalayan_trek",
            "show_in_himalayan_section",
            "is_backpacking_trip",
            "show_in_backpacking_section",
            "is_summer_trek",
            "show_in_summer_section",
            "is_monsoon_trek",
            "show_in_monsoon_section",
            "is_community_trip",
            "show_in_community_section",
            "is_festival_trip",
            "show_in_festival_section",
            "category",
            "category_id",
            "is_featured",
            "featured_highlights",
            "gallery_image_urls",
            "batches",
            "price_options",
            "overview",
            "cancellation_policy",
            "things_to_pack",
            "faqs",
            "pickup_location",
            "drop_location",
        ]
