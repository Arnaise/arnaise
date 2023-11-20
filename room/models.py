from django.db import models
from django.utils import timezone
from authentication.models import CustomUsers


class GameRoom(models.Model):
    creator = models.ForeignKey(
        CustomUsers, on_delete=models.CASCADE, null=False, blank=False
    )
    code = models.CharField(
        max_length=6, unique=True, db_index=True, null=False, blank=False
    )
    is_active = models.BooleanField(default=False)
    start_time = models.DateTimeField(null=True, blank=True)
    questions_json = models.TextField(null=False, blank=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Game Rooms"

    def start_game(self):
        if self.is_active:
            return  # Game already started

        self.is_active = True
        self.start_time = timezone.now()
        self.save()

    def end_game(self):
        if not self.is_active:
            return  # Game not active

        self.is_active = False
        self.save()

    def is_game_active(self):
        return self.is_active

    def get_elapsed_time(self):
        if self.is_active:
            return timezone.now() - self.start_time
        return None


class Player(models.Model):
    user = models.ForeignKey(
        CustomUsers, on_delete=models.CASCADE, null=True, blank=True
    )
    username = models.CharField(max_length=256, blank=True, null=True)
    isGuest = models.BooleanField(default=False)
    game_room = models.ForeignKey(
        GameRoom,
        related_name="player_set",
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )
    score = models.PositiveIntegerField(default=0)
    attempt = models.PositiveIntegerField(default=0)
    join_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Players"

    def update_score(self, points):
        self.score += points
        self.attempt += 1
        self.save()

    def get_time_in_room(self):
        return timezone.now() - self.join_time
