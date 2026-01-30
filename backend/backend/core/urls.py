from django.urls import path
from .views import hello_api, trip_list

urlpatterns = [
    path("v1/hello/", hello_api),
    path("v1/trips/", trip_list),
]
