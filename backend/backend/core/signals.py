"""
This signals.py file is a Django module that defines a signal receiver function to create a user profile when a new user is created. The signal is connected to the post_save signal of the User model, which is triggered after a user is saved to the database. The receiver function checks if the user was created (not updated) and creates a new Profile instance associated with the user. This ensures that every new user has a corresponding profile in the database, which is used to store additional user-specific information such as their role.
"""



from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Profile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
