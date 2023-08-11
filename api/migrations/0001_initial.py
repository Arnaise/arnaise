# Generated by Django 4.2.1 on 2023-08-09 14:30

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Subjects',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('label', models.CharField(help_text='Placeholder for user.', max_length=50, unique=True)),
                ('value', models.CharField(help_text='Fixed parameter value that is required for library.', max_length=50, unique=True)),
                ('show', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='Tenses',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('label', models.CharField(help_text='Placeholder for user.', max_length=50, unique=True)),
                ('value', models.CharField(help_text='Fixed parameter value that is required for library.', max_length=50, unique=True)),
                ('show', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='Verbs',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.CharField(help_text='Fixed parameter value that is required for library.', max_length=50, unique=True)),
                ('isRegular', models.BooleanField()),
                ('show', models.BooleanField(default=True)),
            ],
        ),
    ]
