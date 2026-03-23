from rest_framework import serializers
from ..models import Coupon

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = '__all__'

class CouponValidateSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=50)
    trip_id = serializers.IntegerField(required=False, allow_null=True)
    booking_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
