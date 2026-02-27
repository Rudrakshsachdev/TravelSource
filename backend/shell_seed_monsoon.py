from core.models import Trip, MonsoonSectionConfig, Category

def seed():
    # Setup Monsoon Config
    config, _ = MonsoonSectionConfig.objects.get_or_create(pk=1)
    config.is_enabled = True
    config.title = "Emerald Monsoon Escapes"
    config.subtitle = "Witness nature's rebirth in the misty mountains"
    config.scroll_speed = 50
    config.save()
    print("Monsoon Config Seeded.")

    # Create Monsoon Category
    category, created = Category.objects.get_or_create(
        slug="monsoon",
        defaults={
            "name": "Monsoon",
            "emoji": "🌧️",
            "grad_start": "#0d9488",
            "grad_end": "#5eead4"
        }
    )
    if created:
        print("Monsoon Category created.")
    else:
        print("Monsoon Category already exists.")

    # Create a Monsoon Trip
    trip, created = Trip.objects.get_or_create(
        title="Valley of Flowers Monsoon Trek",
        defaults={
            "location": "Uttarakhand, India",
            "price": 18500,
            "duration_days": 6,
            "description": "Experience the world-renowned Valley of Flowers in full bloom during the peak monsoon. A UNESCO World Heritage site known for its diverse alpine flora and breathtaking mist-covered meadows.",
            "short_description": "A botanical paradise in the heart of the Himalayas.",
            "image": "https://images.unsplash.com/photo-1589131602758-df598b046830?q=80&w=1200",
            "category": category,
            "is_monsoon_trek": True,
            "show_in_monsoon_section": True,
            "monsoon_display_order": 1,
            "is_active": True
        }
    )
    if not created:
        trip.category = category
        trip.is_monsoon_trek = True
        trip.show_in_monsoon_section = True
        trip.is_active = True
        trip.save()
        print(f"Monsoon Trip '{trip.title}' updated.")
    else:
        print(f"Monsoon Trip '{trip.title}' created.")

    print("Seeding completed successfully.")

seed()
exit()
