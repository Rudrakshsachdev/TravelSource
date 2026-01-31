from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Trip
from .serializers import TripSerializer

from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .auth_serializer import LoginSerializer

from rest_framework.permissions import IsAuthenticated

from .signup_serializer import SignupSerializer
from rest_framework.permissions import AllowAny

from rest_framework.generics import RetrieveAPIView

from .models import Enquiry
from .enquiry_serializer import EnquirySerializer
from rest_framework.permissions import AllowAny



@api_view(["GET"])
def trip_list(request):
    trips = Trip.objects.filter(is_active=True)
    serializer = TripSerializer(trips, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def trip_detail(request, pk):
    try:
        trip = Trip.objects.get(pk=pk, is_active=True)
    except Trip.DoesNotExist:
        return Response(
            {"detail": "Trip not found"},
            status=404
        )

    serializer = TripSerializer(trip)
    return Response(serializer.data)


@api_view(["GET"])
def hello_api(request):
    return Response({"message": "Hello from TravelSource API"})

@api_view(["POST"])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user = serializer.validated_data["user"]
    refresh = RefreshToken.for_user(user)

    # Get role from profile
    role = "USER"
    if hasattr(user, "profile"):
        role = user.profile.role

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "role": role,
        "username": user.username,
    })




@api_view(["GET"])
@permission_classes([IsAuthenticated])
def protected_test_view(request):
    return Response({
        "message": f"Hello {request.user.username}, you are authenticated!"
    })


@api_view(["POST"])
@permission_classes([AllowAny])
def signup_view(request):
    serializer = SignupSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()

    return Response({
        "message": "User created successfully",
        "username": user.username,
        "role": "USER"
    }, status=201)



@api_view(["POST"])
@permission_classes([AllowAny])
def create_enquiry(request):
    serializer = EnquirySerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    enquiry = serializer.save()

    # attach logged-in user if present
    if request.user.is_authenticated:
        enquiry.user = request.user
        enquiry.save()

    return Response(
        {"message": "Enquiry submitted successfully"},
        status=201
    )
