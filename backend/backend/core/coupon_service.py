from decimal import Decimal
from django.utils import timezone
from django.db.models import Q, F
from .models import Coupon


def _calculate_discount(coupon, booking_amount):
    """
    Pure calculation helper — given a Coupon instance and a booking amount,
    returns the Decimal discount value (capped by max_discount and booking amount).
    
    This is shared by both validate_coupon() and get_applicable_coupons()
    so the math is never duplicated.
    """
    booking_amt = Decimal(str(booking_amount))
    discount = Decimal("0.00")

    if coupon.discount_type == "PERCENTAGE":
        # e.g. 10% of ₹5000 = ₹500
        discount = (booking_amt * coupon.discount_value) / Decimal("100")
        # Apply the max-discount cap if one is set
        if coupon.max_discount and discount > coupon.max_discount:
            discount = coupon.max_discount
    elif coupon.discount_type == "FLAT":
        discount = coupon.discount_value

    # Discount can never exceed the booking amount itself
    if discount > booking_amt:
        discount = booking_amt

    return discount


def _build_coupon_description(coupon):
    """
    Generates a short, user-friendly description string for a coupon.
    Example: "Get 10% off (up to ₹500)" or "Flat ₹200 off on orders above ₹1000"
    """
    if coupon.discount_type == "PERCENTAGE":
        desc = f"Get {coupon.discount_value}% off"
        if coupon.max_discount:
            desc += f" (up to ₹{coupon.max_discount})"
    else:
        desc = f"Flat ₹{coupon.discount_value} off"

    if coupon.min_booking_amount and coupon.min_booking_amount > 0:
        desc += f" on orders above ₹{coupon.min_booking_amount}"

    return desc


def validate_coupon(code, user_id=None, trip_id=None, booking_amount=0):
    """
    Validates a single coupon code against all business rules.
    
    Steps:
      1. Check if the code exists
      2. Check active status
      3. Check expiry date
      4. Check usage limit
      5. Check user restriction
      6. Check trip restriction
      7. Check minimum booking amount
      8. Calculate discount using _calculate_discount()
    
    Returns dict: { valid, discount_amount, final_amount, message, coupon }
    """
    booking_amt = Decimal(str(booking_amount))

    # --- 1. Check existence (case-insensitive) ---
    try:
        coupon = Coupon.objects.get(code__iexact=code)
    except Coupon.DoesNotExist:
        return {"valid": False, "message": "Invalid coupon code.", "discount_amount": 0, "final_amount": float(booking_amt), "coupon": None}

    # --- 2. Active? ---
    if not coupon.is_active:
        return {"valid": False, "message": "This coupon is no longer active.", "discount_amount": 0, "final_amount": float(booking_amt), "coupon": None}

    # --- 3. Expired? ---
    if coupon.expiry_date and coupon.expiry_date < timezone.now():
        return {"valid": False, "message": "This coupon has expired.", "discount_amount": 0, "final_amount": float(booking_amt), "coupon": None}

    # --- 4. Usage limit reached? ---
    if coupon.usage_limit > 0 and coupon.times_used >= coupon.usage_limit:
        return {"valid": False, "message": "This coupon usage limit has been reached.", "discount_amount": 0, "final_amount": float(booking_amt), "coupon": None}

    # --- 5. User-specific? ---
    if coupon.user_id and str(coupon.user_id) != str(user_id):
        return {"valid": False, "message": "This coupon is not assigned to your account.", "discount_amount": 0, "final_amount": float(booking_amt), "coupon": None}

    # --- 6. Trip-specific? ---
    if coupon.trip_id and str(coupon.trip_id) != str(trip_id):
        trip_name = coupon.trip.title if coupon.trip else "another trip"
        return {"valid": False, "message": f"This coupon is only valid for {trip_name}.", "discount_amount": 0, "final_amount": float(booking_amt), "coupon": None}

    # --- 7. Minimum booking amount ---
    if booking_amt < coupon.min_booking_amount:
        return {"valid": False, "message": f"Minimum booking amount of ₹{coupon.min_booking_amount} is required.", "discount_amount": 0, "final_amount": float(booking_amt), "coupon": None}

    # --- 8. Calculate discount ---
    discount = _calculate_discount(coupon, booking_amount)
    final_amount = booking_amt - discount

    return {
        "valid": True,
        "message": f"Coupon '{coupon.code}' applied successfully!",
        "discount_amount": float(discount),
        "final_amount": float(final_amount),
        "coupon": coupon,
    }


def record_coupon_usage(coupon):
    """
    Atomically increments times_used using Django F() expression.
    This prevents race conditions when two users redeem the same coupon
    at the exact same time.
    """
    if coupon:
        Coupon.objects.filter(pk=coupon.pk).update(times_used=F("times_used") + 1)


def get_applicable_coupons(user_id, trip_id, booking_amount):
    """
    Returns all coupons that are valid for this user + trip + amount combination,
    sorted by discount (highest first). The first item is the "best coupon".

    Algorithm:
      1. Single DB query pulls all active, non-expired, non-exhausted coupons.
      2. Python-side loop filters by user/trip eligibility and min-amount.
      3. _calculate_discount() computes the savings for each.
      4. Results are sorted descending by discount_amount.
      5. The top item is flagged as "best_coupon" in the response.

    Returns:
      {
        "best_coupon": { code, discount_type, discount_value, discount_amount, description } | None,
        "all_coupons": [ { code, discount_type, discount_value, discount_amount, description }, ... ]
      }
    """
    now = timezone.now()
    booking_amt = Decimal(str(booking_amount))

    # ── Step 1: Efficient DB query ──────────────────────────────────────────
    # Pull only active coupons that haven't expired and haven't hit their usage cap.
    # We use Q objects for the expiry/usage conditions to handle nullable fields.
    coupons = Coupon.objects.filter(
        is_active=True,
    ).filter(
        Q(expiry_date__isnull=True) | Q(expiry_date__gte=now)       # not expired
    ).filter(
        Q(usage_limit=0) | Q(times_used__lt=F("usage_limit"))       # usage not exhausted
    )

    # ── Step 2: Python-side eligibility filter ──────────────────────────────
    # We can't perfectly express "user is None OR user == X" in one query
    # without extra complexity, so we filter in Python (coupon count is small).
    applicable = []

    for coupon in coupons:
        # User restriction: coupon is for a specific user — skip if not this user
        if coupon.user_id and coupon.user_id != user_id:
            continue

        # Trip restriction: coupon is for a specific trip — skip if not this trip
        if coupon.trip_id and str(coupon.trip_id) != str(trip_id):
            continue

        # Min booking amount: skip if the booking total is below the threshold
        if booking_amt < coupon.min_booking_amount:
            continue

        # ── Step 3: Calculate the discount ──────────────────────────────────
        discount = _calculate_discount(coupon, booking_amount)

        # Skip coupons that yield zero discount (edge case safeguard)
        if discount <= 0:
            continue

        # Build the description string for the frontend
        if coupon.discount_type == "PERCENTAGE":
            desc = f"Get {coupon.discount_value}% off"
            if coupon.max_discount:
                desc += f" (up to ₹{coupon.max_discount})"
        else:
            desc = f"Flat ₹{coupon.discount_value} off"

        if coupon.min_booking_amount and coupon.min_booking_amount > 0:
            desc += f" on bookings above ₹{coupon.min_booking_amount}"

        applicable.append({
            "code": coupon.code,
            "discount_type": coupon.discount_type,
            "discount_value": float(coupon.discount_value),
            "max_discount": float(coupon.max_discount) if coupon.max_discount else None,
            "discount_amount": float(discount),
            "description": desc,
        })

    # ── Step 4: Sort — highest discount first ───────────────────────────────
    applicable.sort(key=lambda c: c["discount_amount"], reverse=True)

    # ── Step 5: Build the response ──────────────────────────────────────────
    best = applicable[0] if applicable else None

    return {
        "best_coupon": best,
        "all_coupons": applicable,
    }
