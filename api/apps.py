from django.apps import AppConfig
import os


class MyapiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api"

    def ready(self):
        from . import jobs

        if os.environ.get("RUN_MAIN", None) != "true":
            jobs.start_scheduler()
