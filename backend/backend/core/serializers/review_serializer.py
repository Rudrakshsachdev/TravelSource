from rest_framework import serializers
from django.utils import timezone
from ..models import Review


class ReviewSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ["id", "name", "country", "trip", "rating", "review", "date", "avatar"]
        read_only_fields = ["id", "date", "avatar"]

    def get_date(self, obj):
        now = timezone.now()
        diff = now - obj.created_at
        days = diff.days
        if days == 0:
            return "Today"
        elif days == 1:
            return "Yesterday"
        elif days < 7:
            return f"{days} days ago"
        elif days < 14:
            return "1 week ago"
        elif days < 21:
            return "2 weeks ago"
        elif days < 28:
            return "3 weeks ago"
        elif days < 60:
            return "1 month ago"
        else:
            return f"{days // 30} months ago"

    def get_avatar(self, obj):
        parts = obj.name.strip().split()
        if len(parts) >= 2:
            return (parts[0][0] + parts[-1][0]).upper()
        elif parts:
            return parts[0][:2].upper()
        return "??"
