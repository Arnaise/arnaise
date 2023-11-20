import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import GameRoom, Player
from authentication.models import CustomUsers
from datetime import datetime


class LobbyConsumer(AsyncWebsocketConsumer):
    # Maintain a dictionary of connected users for each room
    connected_users_by_room = {}

    # Utility function to send JSON data over the websocket
    async def send_json(self, data):
        await self.send(text_data=json.dumps(data))

    # WebSocket connection establishment
    async def connect(self):
        # Extract room code from the URL
        self.room_code = self.scope["url_route"]["kwargs"]["room_code"]
        self.room_group_name = f"lobby_{self.room_code}"
        try:
            self.room = await self.get_room_by_code(self.room_code)
            # Add the consumer to the room group and accept the connection
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()
        except:
            pass

    # WebSocket connection termination
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

        # Remove the user from the connected users dictionary if present
        if self.channel_name in self.connected_users_by_room.get(self.room_code, {}):
            user_id = self.connected_users_by_room[self.room_code][self.channel_name]
            del self.connected_users_by_room[self.room_code][self.channel_name]
            await self.send_group_update("update.players")

    # Receiving messages from the WebSocket
    async def receive(self, text_data):
        message = json.loads(text_data)
        message_type = message.get("type")
        message_data = message.get("data")

        if message_type == "join":
            await self.join_lobby(message_data)
        if message_type == "guest":
            await self.guest_join_lobby(message_data)
        elif message_type == "start":
            await self.start_game()
        elif message_type == "progress":
            await self.update_progress(message_data)
        elif message_type == "end":
            await self.end_game()
        elif message_type == "get_status":
            await self.send_group_update("update.players")

    # Handling user joining the lobby
    async def join_lobby(self, payload):
        user_id = payload["user_id"]
        if user_id:
            player = await self.create_or_get_player(user_id, self.room)
            self.player = player
            self.connected_users_by_room.setdefault(self.room_code, {})[
                self.channel_name
            ] = user_id
            await self.send_group_update("update.players")

    # Handling guest user joining the lobby
    async def guest_join_lobby(self, payload):
        username = payload["username"]
        if username:
            player = await self.create_or_get_guest_player(username, self.room)
            self.player = player
            self.connected_users_by_room.setdefault(self.room_code, {})[
                self.channel_name
            ] = username
            await self.send_group_update("update.players")

    # Handling the "start" message
    async def start_game(self):
        await self.update_game_start_status()  # Update the game status to active
        await self.send_group_update("update.status")

    # Handling the "progress" message
    async def update_progress(self, payload):
        points = payload["points"]
        await self.update_game_progress(points)  # Update the player progress
        await self.send_group_update("update.players")

    # Handling the "end" message
    async def end_game(self):
        await self.update_game_end_status()  # Update the game status to expired
        await self.send_group_update("update.expire")

    # Sending group-wide updates
    async def send_group_update(self, type):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": type,
            },
        )

    # Handling the "update.players" event
    async def update_players(self, event):
        player_data = await self.get_player_data()
        await self.send_json({"type": "update.players", "players": player_data})

    # Handling the "update.status" event
    async def update_status(self, event):
        await self.send_json({"type": "update.status", "status": "Progress"})

    # Handling the "update.expire" event
    async def update_expire(self, event):
        await self.send_json({"type": "update.expire", "status": "Expired"})

    # Database-related functions
    @database_sync_to_async
    def get_room_by_code(self, room_code):
        return GameRoom.objects.get(code=room_code)

    @database_sync_to_async
    def create_or_get_player(self, user_id, room):
        user = CustomUsers.objects.get(pk=int(user_id))
        if user:
            player, _ = Player.objects.get_or_create(user=user, game_room=room)
            return player
        return None

    @database_sync_to_async
    def create_or_get_guest_player(self, username, room):
        if username:
            player, _ = Player.objects.get_or_create(
                username=username, isGuest=True, game_room=room
            )
            return player
        return None

    @database_sync_to_async
    def get_player_data(self):
        players = Player.objects.filter(game_room__code=self.room_code).order_by(
            "-attempt"
        )
        return [
            {
                "id": player.user.id if not player.isGuest else None,
                "username": player.user.username if not player.isGuest else player.username,
                "points": player.user.points if not player.isGuest else None,
                "isInLobby": player.user.id
                in self.connected_users_by_room.get(self.room_code, {}).values()
                if not player.isGuest
                else player.username
                in self.connected_users_by_room.get(self.room_code, {}).values(),
                "attempt": player.attempt,
                "roomScore": player.score,
                "isGuest": player.isGuest,
            }
            for player in players
        ]

    @database_sync_to_async
    def update_game_start_status(self):
        if self.player.user.id == self.room.creator.id:
            self.room.start_game()

    @database_sync_to_async
    def update_game_progress(self, points):
        self.player.update_score(points)

    @database_sync_to_async
    def update_game_end_status(self):
        self.room.end_game()

    # ... rest of the methods ...
