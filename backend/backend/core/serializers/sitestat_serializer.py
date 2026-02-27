from rest_framework import serializers
from ..models import SiteStat


class SiteStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteStat
        fields = ["id", "key", "label", "value", "icon"]
