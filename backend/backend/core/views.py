from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Trip
from .serializers import TripSerializer

@api_view(["GET"])
def trip_list(request):
    trips = Trip.objects.filter(is_active=True)
    serializer = TripSerializer(trips, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def hello_api(request):
    return Response({"message": "Hello from TravelSource API"})
