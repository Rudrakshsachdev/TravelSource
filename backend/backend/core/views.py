from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Trip, Enquiry, ContactMessage

from .serializers import (
    TripSerializer,
    LoginSerializer,
    SignupSerializer,
    EnquirySerializer,
    UserEnquirySerializer,
    AdminEnquirySerializer,
    AdminTripSerializer,
    ContactMessageSerializer,
)

from django.shortcuts import get_object_or_404

from django.contrib.auth.models import User
from .serializers import UserAdminSerializer

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



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_enquiries(request):
    enquiries = Enquiry.objects.filter(user=request.user).order_by("-created_at")
    serializer = UserEnquirySerializer(enquiries, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_enquiries(request):
    if request.user.profile.role != "ADMIN":
        return Response(
            {"detail": "Not authorized"},
            status=403
        )

    enquiries = Enquiry.objects.all().order_by("-created_at")
    serializer = AdminEnquirySerializer(enquiries, many=True)
    return Response(serializer.data)



@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def admin_trips(request):
    if request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)

    if request.method == "GET":
        trips = Trip.objects.all().order_by("-id")
        serializer = AdminTripSerializer(trips, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        serializer = AdminTripSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)


@api_view(["PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def admin_trip_detail(request, pk):
    if request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)

    trip = get_object_or_404(Trip, pk=pk)

    if request.method == "PUT":
        serializer = AdminTripSerializer(trip, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    if request.method == "DELETE":
        trip.delete()
        return Response({"detail": "Trip deleted successfully"}, status=204)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def admin_toggle_trip(request, pk):
    if request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)

    trip = get_object_or_404(Trip, pk=pk)
    trip.is_active = not trip.is_active
    trip.save()

    return Response({"is_active": trip.is_active})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_users(request):
    if request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)

    users = User.objects.all().order_by("-date_joined")
    serializer = UserAdminSerializer(users, many=True)
    return Response(serializer.data)




@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_user_role(request, pk):
    if request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)

    user = get_object_or_404(User, pk=pk)

    if user == request.user:
        return Response(
            {"detail": "You cannot change your own role"},
            status=400
        )

    role = request.data.get("role")

    if role not in ["USER", "ADMIN"]:
        return Response({"detail": "Invalid role"}, status=400)

    user.profile.role = role
    user.profile.save()

    return Response({"role": role})




@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_user(request, pk):
    if request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)

    user = get_object_or_404(User, pk=pk)

    if user == request.user:
        return Response(
            {"detail": "You cannot delete yourself"},
            status=400
        )

    user.delete()
    return Response({"detail": "User deleted"})



@api_view(["POST"])
def contact_us(request):
    serializer = ContactMessageSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Message sent successfully"},
            status=201
        )

    return Response(serializer.errors, status=400)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_contact_messages(request):
    if request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)

    messages = ContactMessage.objects.all().order_by("-created_at")
    serializer = ContactMessageSerializer(messages, many=True)
    return Response(serializer.data)
