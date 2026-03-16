from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'

    name = 'backend.backend.core' # backend.backend.core

    def ready(self):
        import backend.backend.core.signals #backend.backend.core.signals
