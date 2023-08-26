from django.urls import path, re_path
from . import views

urlpatterns = [
    # GameRoom URLs
    path("create", views.create_room, name="create_room"),
    path("rooms", views.get_rooms_by_user, name="get_rooms_by_user"),
    re_path(r"^rooms/(?P<user_id>[0-9]+)$", views.get_rooms_by_user),
    path("room/<str:room_code>/start", views.start_game, name="start_game"),
    path("room/<str:room_code>/end", views.end_game, name="end_game"),
    # Player URLs
    path(
        "player/<int:player_id>/update-score",
        views.update_player_score,
        name="update_player_score",
    ),
    path(
        "player/<int:player_id>/time-in-room",
        views.get_player_time_in_room,
        name="get_player_time_in_room",
    ),
]
