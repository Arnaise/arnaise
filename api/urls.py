from django.urls import path, re_path
from . import views

urlpatterns = [
    path("options", views.options, name="options"),
    path("leaderboard", views.leaderboard, name="leaderboard"),
    path("problems", views.problems, name="problems"),
    path("logs", views.logs, name="logs"),
    re_path(r"^logs/(?P<user_id>[0-9]+)$", views.logs),
    path("custom_presets", views.custom_presets, name="custom_presets"),
    re_path(
        r"^custom_preset_detail/(?P<custom_preset_id>[0-9]+)$",
        views.custom_preset_detail,
    ),
]
