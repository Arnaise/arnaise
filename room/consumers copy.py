import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import GameRoom, Player


class LobbyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_code = self.scope["url_route"]["kwargs"]["room_code"]
        self.room_group_name = f"lobby_{self.room_code}"
        self.room = await GameRoom.objects.get(
            code=self.scope["url_route"]["kwargs"]["room_code"]
        )

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        # Handle WebSocket messages
        message = json.loads(text_data)
        message_type = message.get("type")
        message_data = message.get("data")

        if message_type == "join":
            await self.join_lobby(message_data)

    async def join_lobby(self, payload):
        # Add user as a player in the room
        user = payload["user_id"]
        player = await Player.objects.get_or_create(
            user__id=user, game_room=self.room
        )

        print(player)

        # Send message to room group to update online players
        # await self.send_group_update()

    async def send_group_update(self):
        # Broadcast message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "update.players",
            },
        )

    async def update_players(self, event):
        # Send updated player list to the group
        await self.send_json(
            {
                "type": "update.players",
                "players": [
                    {"id": player.id, "fullName": player.user.fullName}
                    for player in Player.objects.filter(game_room__code=self.room_code)
                ],
            }
        )

    async def start_game(self):
        # Handle starting the game (not implemented in this example)
        pass

    async def game_started(self, event):
        # Handle game started event (not implemented in this example)
        pass

    # ... Other methods for handling different events ...
