# Generated by Django 4.1 on 2023-11-13 11:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_custompreset'),
    ]

    operations = [
        migrations.AddField(
            model_name='custompreset',
            name='name',
            field=models.CharField(default='', help_text='Preset name.', max_length=50),
            preserve_default=False,
        ),
    ]
