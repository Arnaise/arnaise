from rest_framework import serializers
from .models import GameRoom, Player
import string, random
from authentication.models import CustomUsers


class GameRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameRoom
        fields = "__all__"
        read_only_fields = ["code"]

    def create(self, validated_data):
        characters = string.digits
        while True:
            code = "".join(random.choice(characters) for _ in range(6))
            if not GameRoom.objects.filter(code=code, is_active=True).exists():
                validated_data["code"] = code
                room = super().create(validated_data)
                user = validated_data["creator"]
                Player.objects.create(user=user, game_room=room)
                return room


class DisplayRoomSerializer(serializers.ModelSerializer):
    user_id = serializers.SerializerMethodField()
    created_by = serializers.SerializerMethodField()
    count_of_players = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = GameRoom
        fields = [
            "user_id",
            "created_by",
            "code",
            "timestamp",
            "count_of_players",
            "status",
        ]

    def get_user_id(self, obj):
        return obj.creator.id

    def get_created_by(self, obj):
        return obj.creator.username

    def get_count_of_players(self, obj):
        return Player.objects.filter(game_room=obj).count()

    def get_status(self, obj):
        if not obj.is_active and not obj.start_time:
            return "Open"
        elif not obj.is_active and obj.start_time:
            return "Expired"
        else:
            return "Progress"


class OneRoomSerializer(serializers.ModelSerializer):
    user_id = serializers.SerializerMethodField()
    created_by = serializers.SerializerMethodField()
    count_of_players = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = GameRoom
        fields = [
            "user_id",
            "timestamp",
            "created_by",
            "count_of_players",
            "status",
            "questions_json",
        ]

    def get_user_id(self, obj):
        return obj.creator.id

    def get_created_by(self, obj):
        return obj.creator.username

    def get_count_of_players(self, obj):
        return Player.objects.filter(game_room=obj).count()

    def get_status(self, obj):
        if not obj.is_active and not obj.start_time:
            return "Open"
        elif not obj.is_active and obj.start_time:
            return "Expired"
        else:
            return "Progress"


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = "__all__"
