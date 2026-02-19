from django.urls import path
from .views import hello_api, trip_list, login_view, protected_test_view, signup_view, trip_detail, create_enquiry, my_enquiries, admin_enquiries, admin_trips, admin_trip_detail, admin_toggle_trip, admin_users, update_user_role, delete_user, contact_us, admin_contact_messages, delete_contact_message, create_booking, user_bookings, admin_bookings, update_booking_status

urlpatterns = [
    path("v1/hello/", hello_api),
    path("v1/trips/", trip_list),
    path("v1/trips/<int:pk>/", trip_detail),
    path("v1/auth/login/", login_view),
    path("v1/auth/signup/", signup_view),
    path("v1/auth/protected/", protected_test_view),
    path("v1/enquiries/", create_enquiry),
    path("v1/my-enquiries/", my_enquiries),
    path("v1/admin/enquiries/", admin_enquiries),
    path("v1/admin/trips/", admin_trips),
    path("v1/admin/trips/<int:pk>/", admin_trip_detail),
    path("v1/admin/trips/<int:pk>/toggle/", admin_toggle_trip),
    path("v1/admin/users/", admin_users),
    path("v1/admin/users/<int:pk>/role/", update_user_role),
    path("v1/admin/users/<int:pk>/", delete_user),
    path("v1/contact/", contact_us),
    path("v1/admin/contact-messages/", admin_contact_messages),
    path("v1/admin/contact-messages/<int:pk>/", delete_contact_message),
    path("v1/bookings/create/", create_booking),
    path("v1/bookings/my/", user_bookings),
    path("v1/admin/bookings/", admin_bookings),
    path("v1/admin/bookings/<int:pk>/status/", update_booking_status),
]

