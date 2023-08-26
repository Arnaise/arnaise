# Generated by Django 4.2.1 on 2023-08-17 16:23

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('room', '0002_alter_gameroom_code'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='gameroom',
            options={'verbose_name_plural': 'Game Rooms'},
        ),
        migrations.AlterModelOptions(
            name='player',
            options={'verbose_name_plural': 'Players'},
        ),
        migrations.AddField(
            model_name='gameroom',
            name='timestamp',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
