from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.response import Response
from rest_framework import status
from .models import GameRoom, Player
from .serializers import (
    GameRoomSerializer,
    PlayerSerializer,
    DisplayRoomSerializer,
    OneRoomSerializer,
)
from rest_framework.parsers import JSONParser


@api_view(["POST"])
@permission_classes([])
@authentication_classes([])
def create_room(request):
    # ... Create a new game room ...
    serializer = GameRoomSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_200_OK)


@api_view(["GET", "POST"])
@permission_classes([])
@authentication_classes([])
def get_rooms_by_user(request, user_id=None):
    if request.method == "GET":
        user_id = int(user_id)

        # Get rooms where the user is the creator
        creator_rooms = GameRoom.objects.filter(creator__id=user_id)

        # Get rooms where the user is a player
        player_rooms = GameRoom.objects.filter(player_set__user__id=user_id)

        # Combine the two querysets without ORDER BY
        rooms = creator_rooms.union(player_rooms)

        # Apply ORDER BY after union
        rooms = rooms.order_by("-timestamp")

        serializer = DisplayRoomSerializer(rooms, many=True)
        return Response(serializer.data)
    if request.method == "POST":
        data = JSONParser().parse(request)
        try:
            room = GameRoom.objects.get(code=data["code"])
            serializer = OneRoomSerializer(room)
            return Response(serializer.data)
        except:
            return Response(
                {"error": "Room not found."},
                status=status.HTTP_200_OK,
            )


@api_view(["POST"])
@permission_classes([])
@authentication_classes([])
def start_game(request, room_code):
    room = GameRoom.objects.filter(code=room_code).first()
    if room and not room.is_game_active():
        room.start_game()
        return Response(
            {"message": "Game started successfully"}, status=status.HTTP_200_OK
        )
    return Response(
        {"error": "Room not found or game is already active"},
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(["POST"])
@permission_classes([])
@authentication_classes([])
def end_game(request, room_code):
    room = GameRoom.objects.filter(code=room_code).first()
    if room and room.is_game_active():
        room.end_game()
        return Response(
            {"message": "Game ended successfully"}, status=status.HTTP_200_OK
        )
    return Response(
        {"error": "Room not found or game is not active"},
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(["POST"])
@permission_classes([])
@authentication_classes([])
def update_player_score(request, player_id):
    player = Player.objects.filter(pk=player_id).first()
    if not player:
        return Response({"error": "Player not found"}, status=status.HTTP_404_NOT_FOUND)

    points = request.data.get("points", 0)
    player.update_score(points)
    return Response(
        {"message": "Player score updated successfully"}, status=status.HTTP_200_OK
    )


@api_view(["GET"])
@permission_classes([])
@authentication_classes([])
def get_player_time_in_room(request, player_id):
    player = Player.objects.filter(pk=player_id).first()
    if not player:
        return Response({"error": "Player not found"}, status=status.HTTP_404_NOT_FOUND)

    time_in_room = player.get_time_in_room()
    return Response(
        {"time_in_room_seconds": time_in_room.total_seconds()},
        status=status.HTTP_200_OK,
    )
