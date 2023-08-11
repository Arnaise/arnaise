from django.urls import path, re_path
from . import views

urlpatterns = [
    path("options", views.options, name="options"),
    path("logs", views.logs, name="logs"),
    re_path(r"^logs/(?P<user_id>[0-9]+)$", views.logs),
]
