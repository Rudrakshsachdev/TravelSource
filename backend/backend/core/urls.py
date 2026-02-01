from django.urls import path
from .views import hello_api, trip_list, login_view, protected_test_view, signup_view, trip_detail, create_enquiry, my_enquiries, admin_enquiries, admin_trips, admin_update_trip, admin_toggle_trip

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
    path("v1/admin/trips/<int:pk>/", admin_update_trip),
    path("v1/admin/trips/<int:pk>/toggle/", admin_toggle_trip),

]
