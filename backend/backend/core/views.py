from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Trip, Enquiry, ContactMessage, Booking, TripView, Review, SiteStat, InternationalSectionConfig, IndiaSectionConfig, NorthIndiaSectionConfig, HoneymoonSectionConfig, HimalayanSectionConfig, BackpackingSectionConfig, SummerSectionConfig, MonsoonSectionConfig, CommunitySectionConfig, FestivalSectionConfig, AdventureSectionConfig, HimachalSectionConfig, UttarakhandSectionConfig, LongWeekendSectionConfig, Category, TripGalleryImage, Coupon
from .coupon_service import validate_coupon, record_coupon_usage, get_applicable_coupons

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
    NorthIndiaTripSerializer,
    NorthIndiaSectionConfigSerializer,
    HoneymoonTripSerializer,
    HoneymoonSectionConfigSerializer,
    HimalayanTripSerializer,
    HimalayanSectionConfigSerializer,
    BackpackingTripSerializer,
    BackpackingSectionConfigSerializer,
    SummerTripSerializer,
    SummerSectionConfigSerializer,
    MonsoonTripSerializer,
    MonsoonSectionConfigSerializer,
    CommunityTripSerializer,
    CommunitySectionConfigSerializer,
    FestivalTripSerializer,
    FestivalSectionConfigSerializer,
    AdventureTripSerializer,
    AdventureSectionConfigSerializer,
    HimachalTripSerializer,
    HimachalSectionConfigSerializer,
    UttarakhandTripSerializer,
    UttarakhandSectionConfigSerializer,
    LongWeekendTripSerializer,
    LongWeekendSectionConfigSerializer,
    CategorySerializer,
    TripGalleryImageSerializer,
    CouponSerializer,
    CouponValidateSerializer,
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

import random
import string
from .models import PasswordResetOTP

@api_view(["GET"])
def trip_list(request):
    trips = Trip.objects.filter(is_active=True)
    category_slug = request.query_params.get("category")
    is_international = request.query_params.get("is_international")
    is_india_trip = request.query_params.get("is_india_trip")
    is_himalayan_trek = request.query_params.get("is_himalayan_trek")
    is_community_trip = request.query_params.get("is_community_trip")
    is_festival_trip = request.query_params.get("is_festival_trip")
    is_honeymoon_trip = request.query_params.get("is_honeymoon_trip")
    is_backpacking_trip = request.query_params.get("is_backpacking_trip")
    is_adventure_trip = request.query_params.get("is_adventure_trip")
    is_himachal_trip = request.query_params.get("is_himachal_trip")
    is_uttarakhand_trip = request.query_params.get("is_uttarakhand_trip")
    is_long_weekend_trip = request.query_params.get("is_long_weekend_trip")
    
    if category_slug:
        trips = trips.filter(category__slug=category_slug)
        
    if is_international and is_international.lower() == "true":
        trips = trips.filter(is_international=True)
        
    if is_india_trip and is_india_trip.lower() == "true":
        trips = trips.filter(is_india_trip=True)
        
    if is_himalayan_trek and is_himalayan_trek.lower() == "true":
        trips = trips.filter(is_himalayan_trek=True)
        
    if is_community_trip and is_community_trip.lower() == "true":
        trips = trips.filter(is_community_trip=True)
        
    if is_festival_trip and is_festival_trip.lower() == "true":
        trips = trips.filter(is_festival_trip=True)
        
    if is_honeymoon_trip and is_honeymoon_trip.lower() == "true":
        trips = trips.filter(is_honeymoon=True)
        
    if is_backpacking_trip and is_backpacking_trip.lower() == "true":
        trips = trips.filter(is_backpacking_trip=True)
        
    if is_adventure_trip and is_adventure_trip.lower() == "true":
        trips = trips.filter(is_adventure_trip=True)
        
    if is_himachal_trip and is_himachal_trip.lower() == "true":
        trips = trips.filter(is_himachal_trip=True)
        
    if is_uttarakhand_trip and is_uttarakhand_trip.lower() == "true":
        trips = trips.filter(is_uttarakhand_trip=True)

    if is_long_weekend_trip and is_long_weekend_trip.lower() == "true":
        trips = trips.filter(is_long_weekend_trip=True)
        
    if is_long_weekend_trip and is_long_weekend_trip.lower() == "true":
        trips = trips.filter(is_long_weekend_trip=True)
        
    serializer = TripSerializer(trips, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([AllowAny])
def featured_trips(request):
    """Return up to 3 featured trips. Falls back to latest 3 if none marked."""
    trips = Trip.objects.filter(is_active=True, is_featured=True).order_by("-id")[:3]
    if not trips.exists():
        trips = Trip.objects.filter(is_active=True).order_by("-id")[:3]
    serializer = TripSerializer(trips, many=True)
    return Response(serializer.data)


# ─── Categories ───────────────────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([AllowAny])
def category_list(request):
    """Return all categories for public display."""
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def admin_categories(request):
    """Admin: list or create categories."""
    if not hasattr(request.user, "profile") or request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)

    if request.method == "GET":
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    # POST — create a new category
    serializer = CategorySerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=201)

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

        coupon_code = request.data.get("coupon_code", "")
        discount_amount = request.data.get("discount_amount", 0)

        # Validate total amount optionally
        frontend_total = request.data.get("total_amount")
        if frontend_total:
            total_amount = float(frontend_total)
        else:
            total_amount = float(trip.price * persons) - float(discount_amount)

        booking = Booking.objects.create(
            user=request.user,
            trip=trip,
            full_name=request.data.get("full_name"),
            email=request.data.get("email"),
            phone=request.data.get("phone"),
            travel_date=request.data.get("travel_date"),
            persons=persons,
            total_amount=total_amount,
            itinerary=request.data.get("itinerary", ""),
            batch_details=request.data.get("batch_details", ""),
            occupancy_details=request.data.get("occupancy_details", ""),
            coupon_code=coupon_code,
            discount_amount=discount_amount
        )

        # If booking is successful and coupon is used, record usage
        if coupon_code:
            try:
                coupon = Coupon.objects.get(code__iexact=coupon_code)
                record_coupon_usage(coupon)
            except Coupon.DoesNotExist:
                pass # Coupon might be invalid or deleted, but booking still succeeds

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
def user_booking_detail(request, pk):
    try:
        booking = Booking.objects.select_related("trip").get(pk=pk, user=request.user)
        serializer = BookingListSerializer(booking)
        return Response(serializer.data)
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found or unauthorized"}, status=404)



    

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


# ─── North India Trips ────────────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([AllowAny])
def north_india_trips(request):
    """Return active North India trips for the scrolling showcase section."""
    config = NorthIndiaSectionConfig.load()
    if not config.is_enabled:
        return Response({"config": {"is_enabled": False}, "trips": []})

    trips = Trip.objects.filter(
        is_active=True,
        is_north_india_trip=True,
        show_in_north_india_section=True,
    ).order_by("north_india_display_order", "-id")

    config_serializer = NorthIndiaSectionConfigSerializer(config)
    trip_serializer = NorthIndiaTripSerializer(trips, many=True)

    return Response({
        "config": config_serializer.data,
        "trips": trip_serializer.data,
    })


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def admin_north_india_config(request):
    """Admin: get or update the North India section configuration."""
    if not hasattr(request.user, "profile") or request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)

    config = NorthIndiaSectionConfig.load()

    if request.method == "GET":
        serializer = NorthIndiaSectionConfigSerializer(config)
        return Response(serializer.data)

    serializer = NorthIndiaSectionConfigSerializer(config, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


# ─── Journey in Frames / Gallery ──────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([AllowAny])
def journey_in_frames_trips(request):
    """Return trips designated to appear in the Journey in Frames section."""
    trips = Trip.objects.filter(
        is_active=True,
        show_in_journey_in_frames=True,
    ).order_by("journey_in_frames_order", "-id")

    serializer = TripSerializer(trips, many=True)
    return Response(serializer.data)


@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def trip_gallery_images(request):
    """
    GET: List gallery images (optionally filter by ?trip_id=)
    POST (Admin only): Add a new gallery image.
    """
    if request.method == "GET":
        images = TripGalleryImage.objects.all()
        trip_id = request.query_params.get("trip_id")
        if trip_id:
            images = images.filter(trip_id=trip_id)
        
        # Optionally filter by type, e.g., ?type=GALLERY
        image_type = request.query_params.get("type")
        if image_type:
            images = images.filter(image_type=image_type.upper())
            
        serializer = TripGalleryImageSerializer(images, many=True)
        return Response(serializer.data)

    # POST validation
    if not hasattr(request.user, "profile") or request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)

    serializer = TripGalleryImageSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=201)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_trip_gallery_image(request, pk):
    """Admin only: Delete a gallery image."""
    if not hasattr(request.user, "profile") or request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)

    image = get_object_or_404(TripGalleryImage, pk=pk)
    image.delete()
    return Response({"detail": "Image deleted successfully"}, status=204)



# ─── Himachal Trips ─────────────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([AllowAny])
def himachal_trips(request):
    """Return active Himachal trips for the scrolling showcase section."""
    config = HimachalSectionConfig.load()
    if not config.is_enabled:
        return Response({"config": {"is_enabled": False}, "trips": []})

    trips = Trip.objects.filter(
        is_active=True,
        is_himachal_trip=True,
        show_in_himachal_section=True,
    ).order_by("himachal_display_order", "-id")

    config_serializer = HimachalSectionConfigSerializer(config)
    trip_serializer = HimachalTripSerializer(trips, many=True)

    return Response({
        "config": config_serializer.data,
        "trips": trip_serializer.data,
    })


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def admin_himachal_config(request):
    """Admin: get or update the Himachal section configuration."""
    if not hasattr(request.user, "profile") or request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)

    config = HimachalSectionConfig.load()

    if request.method == "GET":
        serializer = HimachalSectionConfigSerializer(config)
        return Response(serializer.data)

    serializer = HimachalSectionConfigSerializer(config, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


# ─── Uttarakhand Trips ──────────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([AllowAny])
def uttarakhand_trips(request):
    """Return active Uttarakhand trips for the scrolling showcase section."""
    config = UttarakhandSectionConfig.load()
    if not config.is_enabled:
        return Response({"config": {"is_enabled": False}, "trips": []})

    trips = Trip.objects.filter(
        is_active=True,
        is_uttarakhand_trip=True,
        show_in_uttarakhand_section=True,
    ).order_by("uttarakhand_display_order", "-id")

    config_serializer = UttarakhandSectionConfigSerializer(config)
    trip_serializer = UttarakhandTripSerializer(trips, many=True)

    return Response({
        "config": config_serializer.data,
        "trips": trip_serializer.data,
    })


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def admin_uttarakhand_config(request):
    """Admin: get or update the Uttarakhand section configuration."""
    if not hasattr(request.user, "profile") or request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)

    config = UttarakhandSectionConfig.load()

    if request.method == "GET":
        serializer = UttarakhandSectionConfigSerializer(config)
        return Response(serializer.data)

    serializer = UttarakhandSectionConfigSerializer(config, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([AllowAny])
def honeymoon_trips(request):
    """Return active Honeymoon trips for the scrolling showcase section."""
    config = HoneymoonSectionConfig.load()
    if not config.is_enabled:
        return Response({"config": {"is_enabled": False}, "trips": []})

    trips = Trip.objects.filter(
        is_active=True,
        is_honeymoon=True,
        show_in_honeymoon_section=True,
    ).order_by("honeymoon_display_order", "-id")

    config_serializer = HoneymoonSectionConfigSerializer(config)
    trip_serializer = HoneymoonTripSerializer(trips, many=True)

    return Response({
        "config": config_serializer.data,
        "trips": trip_serializer.data,
    })


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def admin_honeymoon_config(request):
    """Admin: get or update the Honeymoon section configuration."""
    if not hasattr(request.user, "profile") or request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)

    config = HoneymoonSectionConfig.load()

    if request.method == "GET":
        serializer = HoneymoonSectionConfigSerializer(config)
        return Response(serializer.data)

    serializer = HoneymoonSectionConfigSerializer(config, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


# ─── Himalayan Treks ──────────────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([AllowAny])
def himalayan_trips(request):
    """Return active Himalayan Trek trips for the scrolling showcase section."""
    config = HimalayanSectionConfig.load()
    if not config.is_enabled:
        return Response({"config": {"is_enabled": False}, "trips": []})

    trips = Trip.objects.filter(
        is_active=True,
        is_himalayan_trek=True,
        show_in_himalayan_section=True,
    ).order_by("himalayan_display_order", "-id")

    config_serializer = HimalayanSectionConfigSerializer(config)
    trip_serializer = HimalayanTripSerializer(trips, many=True)

    return Response({
        "config": config_serializer.data,
        "trips": trip_serializer.data,
    })


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def admin_himalayan_config(request):
    """Admin: get or update the Himalayan section configuration."""
    if not hasattr(request.user, "profile") or request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)

    config = HimalayanSectionConfig.load()

    if request.method == "GET":
        serializer = HimalayanSectionConfigSerializer(config)
        return Response(serializer.data)

    serializer = HimalayanSectionConfigSerializer(config, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


# ─── Backpacking Trips ────────────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([AllowAny])
def backpacking_trips(request):
    """Return active Backpacking trips for the scrolling showcase section."""
    config = BackpackingSectionConfig.load()
    if not config.is_enabled:
        return Response({"config": {"is_enabled": False}, "trips": []})

    trips = Trip.objects.filter(
        is_active=True,
        is_backpacking_trip=True,
        show_in_backpacking_section=True,
    ).order_by("backpacking_display_order", "-id")

    config_serializer = BackpackingSectionConfigSerializer(config)
    trip_serializer = BackpackingTripSerializer(trips, many=True)

    return Response({
        "config": config_serializer.data,
        "trips": trip_serializer.data,
    })
@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def admin_backpacking_config(request):
    """Admin: get or update the Backpacking section configuration."""
    if not hasattr(request.user, "profile") or request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)

    config = BackpackingSectionConfig.load()

    if request.method == "GET":
        serializer = BackpackingSectionConfigSerializer(config)
        return Response(serializer.data)

    serializer = BackpackingSectionConfigSerializer(config, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)




# ─── Summer Treks ─────────────────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([AllowAny])
def summer_trips(request):
    """Return active Summer Trek trips for the scrolling showcase section."""
    config = SummerSectionConfig.load()
    if not config.is_enabled:
        return Response({"config": {"is_enabled": False}, "trips": []})

    trips = Trip.objects.filter(
        is_active=True,
        is_summer_trek=True,
        show_in_summer_section=True,
    ).order_by("summer_display_order", "-id")

    config_serializer = SummerSectionConfigSerializer(config)
    trip_serializer = SummerTripSerializer(trips, many=True)

    return Response({
        "config": config_serializer.data,
        "trips": trip_serializer.data,
    })


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def admin_summer_config(request):
    """Admin: get or update the Summer section configuration."""
    if not hasattr(request.user, "profile") or request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)

    config = SummerSectionConfig.load()

    if request.method == "GET":
        serializer = SummerSectionConfigSerializer(config)
        return Response(serializer.data)

    serializer = SummerSectionConfigSerializer(config, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


# ─── Monsoon Treks ────────────────────────────────────────────────────────────

@api_view(["GET"])
def monsoon_trips(request):
    """Fetch the configuration and active trips for the Monsoon section."""
    config = MonsoonSectionConfig.load()
    trips = Trip.objects.filter(
        is_active=True,
        is_monsoon_trek=True,
        show_in_monsoon_section=True,
    ).order_by("monsoon_display_order", "-id")

    config_serializer = MonsoonSectionConfigSerializer(config)
    trip_serializer = MonsoonTripSerializer(trips, many=True)

    return Response({
        "config": config_serializer.data,
        "trips": trip_serializer.data,
    })


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def admin_monsoon_config(request):
    """Admin: get or update the Monsoon section configuration."""
    if not hasattr(request.user, "profile") or request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)

    config = MonsoonSectionConfig.load()

    if request.method == "GET":
        serializer = MonsoonSectionConfigSerializer(config)
        return Response(serializer.data)

    serializer = MonsoonSectionConfigSerializer(config, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


# ─── Community Trips ─────────────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([AllowAny])
def community_trips(request):
    """Return active Community trips for the scrolling showcase section."""
    config = CommunitySectionConfig.load()
    if not config.is_enabled:
        return Response({"config": {"is_enabled": False}, "trips": []})

    trips = Trip.objects.filter(
        is_active=True,
        is_community_trip=True,
        show_in_community_section=True,
    ).order_by("community_display_order", "-id")

    config_serializer = CommunitySectionConfigSerializer(config)
    trip_serializer = CommunityTripSerializer(trips, many=True)

    return Response({
        "config": config_serializer.data,
        "trips": trip_serializer.data,
    })


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def admin_community_config(request):
    """Admin: get or update the Community section configuration."""
    if not hasattr(request.user, "profile") or request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)

    config = CommunitySectionConfig.load()

    if request.method == "GET":
        serializer = CommunitySectionConfigSerializer(config)
        return Response(serializer.data)

    serializer = CommunitySectionConfigSerializer(config, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)







@api_view(['GET'])
@permission_classes([AllowAny])
def good_friday_trips(request):
    """Fetch trips that are explicitly selected for the Good Friday trips showcase."""
    trips = Trip.objects.filter(is_active=True, show_in_good_friday_section=True).order_by('good_friday_display_order')
    serializer = TripSerializer(trips, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def all_good_friday_trips(request):
    """Fetch all trips labeled as Good Friday trips."""
    trips = Trip.objects.filter(is_active=True, is_good_friday_trip=True).order_by('id')
    serializer = TripSerializer(trips, many=True)
    return Response(serializer.data)




@api_view(["POST"])
@permission_classes([AllowAny])
def request_password_reset(request):
    email = request.data.get("email")
    if not email:
        return Response({"error": "Email is required"}, status=400)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # For security reasons, don't tell the user the email doesn't exist
        # But for this specific requirement "error handling (for unregistered emails)"
        # I will show the error as requested.
        return Response({"error": "No account found with this email adress"}, status=404)

    # Generate 6-digit OTP
    otp = ''.join(random.choices(string.digits, k=6))
    
    # Update or create OTP
    PasswordResetOTP.objects.update_or_create(
        email=email,
        defaults={"otp": otp, "is_verified": False}
    )

    # Send Email
    subject = "Password Reset OTP | Travel Professor"
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #2e8b7a; text-align: center;">Travel Professor</h2>
        <p>Hello {user.username},</p>
        <p>You requested a password reset. Use the following 6-digit OTP to verify your identity:</p>
        <div style="text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1a3a35; padding: 20px; background: #f0fdfa; border-radius: 8px; margin: 20px 0;">
            {otp}
        </div>
        <p>This OTP will be required in the next step of the reset process.</p>
        <p>If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">Securing your journey with 256-bit encryption.</p>
    </div>
    """
    text_content = f"Your OTP for password reset is: {otp}"

    try:
        email_msg = EmailMultiAlternatives(
            subject,
            text_content,
            settings.DEFAULT_FROM_EMAIL,
            [email],
        )
        email_msg.attach_alternative(html_content, "text/html")
        email_msg.send()
    except Exception as e:
        return Response({"error": f"Failed to send email: {str(e)}"}, status=500)

    return Response({"message": "OTP sent successfully to your email."})


@api_view(["POST"])
@permission_classes([AllowAny])
def verify_reset_otp(request):
    email = request.data.get("email")
    otp = request.data.get("otp")

    if not email or not otp:
        return Response({"error": "Email and OTP are required"}, status=400)

    try:
        otp_record = PasswordResetOTP.objects.get(email=email, otp=otp)
        # Check if expired (e.g., 10 mins) - for now just verify
        otp_record.is_verified = True
        otp_record.save()
        return Response({"message": "OTP verified successfully. You can now reset your password."})
    except PasswordResetOTP.DoesNotExist:
        return Response({"error": "Invalid OTP"}, status=400)


@api_view(["POST"])
@permission_classes([AllowAny])
def reset_password(request):
    email = request.data.get("email")
    new_password = request.data.get("new_password")

    if not email or not new_password:
        return Response({"error": "Email and new password are required"}, status=400)

    try:
        otp_record = PasswordResetOTP.objects.get(email=email)
        if not otp_record.is_verified:
            return Response({"error": "OTP not verified"}, status=400)
        
        user = User.objects.get(email=email)
        user.set_password(new_password)
        user.save()

        # Delete OTP record after successful reset
        otp_record.delete()

        return Response({"message": "Password reset successfully. You can now log in."})
    except (PasswordResetOTP.DoesNotExist, User.DoesNotExist):
        return Response({"error": "Invalid request"}, status=400)

# ─── Festival Section ───────────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([AllowAny])
def festival_trips(request):
    """Public: return festival section config and its active trips."""
    config = FestivalSectionConfig.load()
    trips = Trip.objects.filter(
        is_active=True,
        is_festival_trip=True,
        show_in_festival_section=True
    ).order_by("festival_display_order")
    
    return Response({
        "config": FestivalSectionConfigSerializer(config).data,
        "trips": FestivalTripSerializer(trips, many=True).data
    })


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def admin_festival_config(request):
    """Admin: get or update festival section configuration."""
    if not hasattr(request.user, "profile") or request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)
        
    config = FestivalSectionConfig.load()
    if request.method == "GET":
        return Response(FestivalSectionConfigSerializer(config).data)
    
    # PATCH
    serializer = FestivalSectionConfigSerializer(config, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


# ─── Adventure Section ───────────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([AllowAny])
def adventure_trips(request):
    """Public: return adventure section config and its active trips."""
    config = AdventureSectionConfig.load()
    trips = Trip.objects.filter(
        is_active=True,
        is_adventure_trip=True,
        show_in_adventure_section=True
    ).order_by("adventure_display_order")
    
    return Response({
        "config": AdventureSectionConfigSerializer(config).data,
        "trips": AdventureTripSerializer(trips, many=True).data
    })


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def admin_adventure_config(request):
    """Admin: get or update adventure section configuration."""
    if not hasattr(request.user, "profile") or request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)
        
    config = AdventureSectionConfig.load()
    if request.method == "GET":
        return Response(AdventureSectionConfigSerializer(config).data)
    
    # PATCH
    serializer = AdventureSectionConfigSerializer(config, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


# ─── Long Weekend Section ───────────────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([AllowAny])
def long_weekend_trips(request):
    """Return active long weekend trips for the scrolling showcase section."""
    config = LongWeekendSectionConfig.load()
    if not config.is_enabled:
        return Response({"config": {"is_enabled": False}, "trips": []})

    trips = Trip.objects.filter(
        is_active=True,
        is_long_weekend_trip=True,
        show_in_long_weekend_section=True,
    ).order_by("long_weekend_display_order", "-id")

    config_serializer = LongWeekendSectionConfigSerializer(config)
    trip_serializer = LongWeekendTripSerializer(trips, many=True)

    return Response({
        "config": config_serializer.data,
        "trips": trip_serializer.data,
    })


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def admin_long_weekend_config(request):
    """Admin: get or update the Long Weekend section configuration."""
    if not hasattr(request.user, "profile") or request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)

    config = LongWeekendSectionConfig.load()

    if request.method == "GET":
        serializer = LongWeekendSectionConfigSerializer(config)
        return Response(serializer.data)

    serializer = LongWeekendSectionConfigSerializer(config, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


# ─── Coupons ──────────────────────────────────────────────────────────────────

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def validate_coupon_view(request):
    """Validate a coupon and return discount details."""
    serializer = CouponValidateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    code = serializer.validated_data["code"]
    trip_id = serializer.validated_data.get("trip_id")
    booking_amount = serializer.validated_data["booking_amount"]
    
    result = validate_coupon(
        code=code,
        user_id=request.user.id,
        trip_id=trip_id,
        booking_amount=booking_amount
    )
    
    # We remove the actual Coupon model instance from the API response
    result.pop("coupon", None)
    
    if not result["valid"]:
        return Response(result, status=400)
    
    return Response(result, status=200)

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def admin_coupons(request):
    """Admin: list all coupons or create a new coupon."""
    if not hasattr(request.user, "profile") or request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)

    if request.method == "GET":
        coupons = Coupon.objects.all().order_by("-created_at")
        serializer = CouponSerializer(coupons, many=True)
        return Response(serializer.data)

    # POST - Create
    serializer = CouponSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=201)

@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def admin_coupon_detail(request, pk):
    """Admin: retrieve, update, or delete a specific coupon."""
    if not hasattr(request.user, "profile") or request.user.profile.role != "ADMIN":
        return Response({"detail": "Not authorized"}, status=403)

    coupon = get_object_or_404(Coupon, pk=pk)

    if request.method == "GET":
        serializer = CouponSerializer(coupon)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = CouponSerializer(coupon, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    elif request.method == "DELETE":
        coupon.delete()
        return Response({"detail": "Coupon deleted successfully"}, status=204)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def applicable_coupons_view(request):
    """
    Returns all coupons applicable to this user + trip + booking amount.
    The response includes a 'best_coupon' (highest discount) and the full list.

    Query params:
      - trip_id (int, required)
      - booking_amount (decimal, required)
    """
    trip_id = request.query_params.get("trip_id")
    booking_amount = request.query_params.get("booking_amount", 0)

    if not trip_id or not booking_amount:
        return Response({"detail": "trip_id and booking_amount are required."}, status=400)

    try:
        booking_amount = float(booking_amount)
    except (ValueError, TypeError):
        return Response({"detail": "booking_amount must be a number."}, status=400)

    result = get_applicable_coupons(
        user_id=request.user.id,
        trip_id=trip_id,
        booking_amount=booking_amount,
    )

    return Response(result, status=200)
