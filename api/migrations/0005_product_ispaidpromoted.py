# Generated by Django 4.2.1 on 2023-08-01 03:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_productinteractions_isemail'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='isPaidPromoted',
            field=models.BooleanField(default=False),
        ),
    ]
