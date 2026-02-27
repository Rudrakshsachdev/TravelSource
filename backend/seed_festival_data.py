import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import Trip, FestivalSectionConfig

def seed_festival_data():
    # 1. Ensure Config exists
    config = FestivalSectionConfig.load()
    config.is_enabled = True
    config.title = "Sparkling Festival Getaways"
    config.subtitle = "Exclusive festive packages for a magical season of celebration."
    config.scroll_speed = 45
    config.save()
    print("Festival config updated.")

    # 2. Mark some trips
    trip_titles = ['Kashmir Paradise Trip', 'Manali Adventure Trip', 'Bali Tropical Escape']
    for i, title in enumerate(trip_titles):
        try:
            trip = Trip.objects.get(title=title)
            trip.is_festival_trip = True
            trip.show_in_festival_section = True
            trip.festival_display_order = i + 1
            trip.save()
            print(f"Updated trip: {title}")
        except Trip.DoesNotExist:
            print(f"Trip not found: {title}")

if __name__ == "__main__":
    seed_festival_data()
