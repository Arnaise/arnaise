# Generated by Django 4.1 on 2023-11-17 12:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('room', '0005_alter_player_game_room'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gameroom',
            name='code',
            field=models.CharField(db_index=True, max_length=6, unique=True),
        ),
    ]
