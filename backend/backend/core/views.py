from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Trip, Enquiry, ContactMessage, Booking, TripView, Review, SiteStat, InternationalSectionConfig, IndiaSectionConfig

from .serializers import (
    TripSerializer,
    LoginSerializer,
    SignupSerializer,
    EnquirySerializer,
    UserEnquirySerializer,
    AdminEnquirySerializer,
    AdminTripSerializer,
    ContactMessageSerializer,
    BookingCreateSerializer,
    BookingListSerializer,
    ReviewSerializer,
    SiteStatSerializer,
    InternationalTripSerializer,
    InternationalSectionConfigSerializer,
    IndiaTripSerializer,
    IndiaSectionConfigSerializer,
)

from django.shortcuts import get_object_or_404

from django.contrib.auth.models import User
from .serializers import UserAdminSerializer

import uuid
from django.conf import settings
from .utils import generate_easebuzz_hash
import razorpay

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings

@api_view(["GET"])
def trip_list(request):
    trips = Trip.objects.filter(is_active=True)
    serializer = TripSerializer(trips, many=True)
    return Response(serializer.data)

# ─── Reviews ──────────────────────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([AllowAny])
def list_reviews(request):
    reviews = Review.objects.all()
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([AllowAny])
def create_review(request):
    serializer = ReviewSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

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


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_contact_message(request, pk):
    if request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)
    
    try:
        message = ContactMessage.objects.get(pk=pk)
        message.delete()
        return Response(status=204)
    except ContactMessage.DoesNotExist:
        return Response({"detail": "Message not found"}, status=404)




@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_booking(request):
    try:
        trip_id = request.data.get("trip")
        persons = int(request.data.get("persons", 1))

        if persons <= 0:
            return Response({"error": "Invalid Number of persons"}, status=400)
        
        trip = Trip.objects.get(id=trip_id)

        total_amount = trip.price * persons

        booking = Booking.objects.create(
            user = request.user,

            trip = trip,

            full_name = request.data.get("full_name"),

            email = request.data.get("email"),

            phone = request.data.get("phone"),
            
            travel_date = request.data.get("travel_date"),

            persons = persons,

            total_amount = total_amount,

        )

        serializer = BookingCreateSerializer(booking)

        return Response(serializer.data, status=201)

    except Trip.DoesNotExist:
        return Response({"error": "Trip not found"}, status=404)
        
    except Exception as e:
        return Response({"error" : str(e)}, status=404)




@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_bookings(request):
    bookings = Booking.objects.filter(user=request.user).order_by("-created_at")

    serializer = BookingListSerializer(bookings, many=True)
    
    return Response(serializer.data)


    

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_bookings(request):
    if request.user.profile.role != "ADMIN":
        return Response({"error": "Unauthorized"}, status=403)

    bookings = Booking.objects.select_related("trip", "user").order_by("-created_at")
    serializer = BookingListSerializer(bookings, many=True)
    return Response(serializer.data)





@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_booking_status(request, pk):
    if request.user.profile.role != "ADMIN":
        return Response({"error": "Unauthorized"}, status=403)

    try:
        booking = Booking.objects.get(pk=pk)

        new_status = request.data.get("status")

        if new_status not in ["APPROVED", "DECLINED"]:
            return Response({"error": "Invalid status"}, status=400)

        booking.status = new_status
        booking.admin_note = request.data.get("admin_note", "")
        booking.save()

        if new_status == "APPROVED":
            subject = "Your Booking is Confirmed | Travel Professor",

            html_content = render_to_string(
                "booking_approved.html",
                {
                    "full_name": booking.full_name,
                    "trip_title": booking.trip.title,
                    "persons": booking.persons,
                    "total_amount": booking.total_amount,
                },
            )
        else:
            subject = "Booking Update | Travel Professor",

            html_content = render_to_string(
                "booking_declined.html",
                {
                    "full_name": booking.full_name,
                    "trip_title": booking.trip.title,
                    "persons": booking.persons,
                    "total_amount": booking.total_amount,
                },
            )
        
        text_content = "Please view this email in HTML Format."

        email = EmailMultiAlternatives(
            subject,
            text_content,
            settings.DEFAULT_FROM_EMAIL,
            [booking.email],
        )

        email = EmailMultiAlternatives(
            subject,
            text_content,
            settings.DEFAULT_FROM_EMAIL,
            [booking.email],
        )

        email.attach_alternative(html_content, "text/html")
        email.send()


        serializer = BookingListSerializer(booking)
        return Response(serializer.data)

    except Booking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=404)


# ─── Personalization ─────────────────────────────────────────────────────────

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def record_trip_view(request, pk):
    """Record that the authenticated user viewed a trip."""
    trip = get_object_or_404(Trip, pk=pk, is_active=True)
    TripView.objects.update_or_create(
        user=request.user,
        trip=trip,
        defaults={},
    )
    return Response({"status": "recorded"}, status=200)


@api_view(["GET"])
def recommended_trips(request):
    """
    Return up to 6 recommended trips.
    - Logged-in users: exclude already-viewed trips, prefer similar price range.
    - Anonymous users: accept ?exclude=1,2,3 of client-tracked IDs via query param.
    Returns full TripSerializer data.
    """
    active_trips = Trip.objects.filter(is_active=True)

    # Collect IDs to exclude
    exclude_ids = set()

    if request.user.is_authenticated:
        viewed_ids = list(
            TripView.objects.filter(user=request.user)
            .values_list("trip_id", flat=True)
        )
        exclude_ids.update(viewed_ids)

        # Price-similarity boost: average price of viewed trips
        if viewed_ids:
            viewed_trips = active_trips.filter(pk__in=viewed_ids)
            avg_price = sum(t.price for t in viewed_trips) / len(viewed_trips)
            # Prefer trips within 40% of average viewed price
            lo, hi = avg_price * 0.6, avg_price * 1.4
            candidates = active_trips.exclude(pk__in=exclude_ids).filter(
                price__gte=lo, price__lte=hi
            )[:6]
            if candidates.count() < 3:
                # fallback: any non-viewed trip
                candidates = active_trips.exclude(pk__in=exclude_ids)[:6]
        else:
            candidates = active_trips[:6]
    else:
        # Anonymous: use exclude query param
        raw = request.query_params.get("exclude", "")
        try:
            exclude_ids = {int(x) for x in raw.split(",") if x.strip().isdigit()}
        except ValueError:
            exclude_ids = set()
        candidates = active_trips.exclude(pk__in=exclude_ids)[:6]

    serializer = TripSerializer(candidates, many=True)
    return Response(serializer.data)


# ─── Site Stats (public, read-only) ──────────────────────────────────────────

@api_view(["GET"])
@permission_classes([AllowAny])
def site_stats(request):
    """Return all site stats for public display (animated counters, etc.)."""
    stats = SiteStat.objects.all()
    serializer = SiteStatSerializer(stats, many=True)
    return Response(serializer.data)


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def admin_site_stats(request, pk=None):
    """Admin: list all stats (GET) or update a single stat value (PATCH)."""
    if not hasattr(request.user, "profile") or request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)

    if request.method == "GET":
        stats = SiteStat.objects.all()
        serializer = SiteStatSerializer(stats, many=True)
        return Response(serializer.data)

    # PATCH — update value of a single stat
    stat = get_object_or_404(SiteStat, pk=pk)
    serializer = SiteStatSerializer(stat, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


# ─── International Trips ─────────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([AllowAny])
def international_trips(request):
    """Return active international trips for the scrolling showcase section."""
    config = InternationalSectionConfig.load()
    if not config.is_enabled:
        return Response({"config": {"is_enabled": False}, "trips": []})

    trips = Trip.objects.filter(
        is_active=True,
        is_international=True,
        show_in_international_section=True,
    ).order_by("display_order", "-id")

    config_serializer = InternationalSectionConfigSerializer(config)
    trip_serializer = InternationalTripSerializer(trips, many=True)

    return Response({
        "config": config_serializer.data,
        "trips": trip_serializer.data,
    })


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def admin_international_config(request):
    """Admin: get or update the international section configuration."""
    if not hasattr(request.user, "profile") or request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)

    config = InternationalSectionConfig.load()

    if request.method == "GET":
        serializer = InternationalSectionConfigSerializer(config)
        return Response(serializer.data)

    serializer = InternationalSectionConfigSerializer(config, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


# ─── India Trips ──────────────────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([AllowAny])
def india_trips(request):
    """Return active India trips for the scrolling showcase section."""
    config = IndiaSectionConfig.load()
    if not config.is_enabled:
        return Response({"config": {"is_enabled": False}, "trips": []})

    trips = Trip.objects.filter(
        is_active=True,
        is_india_trip=True,
        show_in_india_section=True,
    ).order_by("india_display_order", "-id")

    config_serializer = IndiaSectionConfigSerializer(config)
    trip_serializer = IndiaTripSerializer(trips, many=True)

    return Response({
        "config": config_serializer.data,
        "trips": trip_serializer.data,
    })


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def admin_india_config(request):
    """Admin: get or update the India section configuration."""
    if not hasattr(request.user, "profile") or request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)

    config = IndiaSectionConfig.load()

    if request.method == "GET":
        serializer = IndiaSectionConfigSerializer(config)
        return Response(serializer.data)

    serializer = IndiaSectionConfigSerializer(config, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)