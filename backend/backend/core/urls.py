from django.urls import path
from .views import hello_api, trip_list, login_view, protected_test_view, signup_view

urlpatterns = [
    path("v1/hello/", hello_api),
    path("v1/trips/", trip_list),
    path("v1/auth/login/", login_view),
    path("v1/auth/signup/", signup_view),
    path("v1/auth/protected/", protected_test_view),
]
