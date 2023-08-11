from django.shortcuts import render
from django.http.response import JsonResponse
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from . import models
from . import serializers
from . import constants
from rest_framework import status
from rest_framework.parsers import JSONParser
from django.contrib.auth.hashers import make_password
import base64
from authentication.models import CustomUsers
from .helpers import email_new_listing


def initialize_backend():
    try:
        # Check if admin exists
        admin_exists = CustomUsers.objects.filter(email="admin@admin.com").exists()
        if not admin_exists:
            # Add admin user
            CustomUsers.objects.create_user(
                password="admin",
                email="admin@admin.com",
                is_staff=True,
                is_superuser=True,
            )
            print("[INITIALIZATION][SUCCESS]: Admin user added")
        else:
            print("[INITIALIZATION][EXISTS]: Admin user already exists")

        # Populate
        if models.Tenses.objects.count() == 0:
            models.Tenses.objects.bulk_create(
                [models.Tenses(**data) for data in constants.TENSES]
            )
            print("[INITIALIZATION][SUCCESS]: TENSES populated")
        else:
            print("[INITIALIZATION][EXISTS]: TENSES already populated")

        if models.Subjects.objects.count() == 0:
            models.Subjects.objects.bulk_create(
                [models.Subjects(**data) for data in constants.SUBJECTS]
            )
            print("[INITIALIZATION][SUCCESS]: SUBJECTS populated")
        else:
            print("[INITIALIZATION][EXISTS]: SUBJECTS already populated")

        if models.Verbs.objects.count() == 0:
            models.Verbs.objects.bulk_create(
                [models.Verbs(**data) for data in constants.VERBS]
            )
            print("[INITIALIZATION][SUCCESS]: VERBS populated")
        else:
            print("[INITIALIZATION][EXISTS]: VERBS already populated")

    except Exception as e:
        print("[INITIALIZATION][ERROR]:", str(e))


# Call the function to initialize the backend
initialize_backend()


@api_view(["GET", "POST"])
@permission_classes([])
@authentication_classes([])
def options(request):
    if request.method == "GET":
        # Serialize all objects and combine them into a single dictionary
        options_data = {}

        # Serialize Tenses objects
        tenses = models.Tenses.objects.filter(show=True)
        tenses_serializer = serializers.TensesSerializer(tenses, many=True)
        options_data["tenses"] = tenses_serializer.data

        # Serialize Category objects
        subjects = models.Subjects.objects.filter(show=True)
        subjects_serializer = serializers.SubjectsSerializer(subjects, many=True)
        options_data["subjects"] = subjects_serializer.data

        # Serialize Measurement objects
        verbs = models.Verbs.objects.filter(show=True)
        verbs_serializer = serializers.VerbsSerializer(verbs, many=True)
        options_data["verbs"] = verbs_serializer.data

        return JsonResponse(options_data)


@api_view(["POST", "PUT", "GET"])
@permission_classes([])
@authentication_classes([])
def logs(request, user_id=None):
    if request.method == "GET":
        if user_id is not None:
            instance = models.Logs.objects.filter(user__id=int(user_id)).order_by(
                "-timestamp"
            )
            object = serializers.ViewLogsSerializer(instance, many=True)
            return JsonResponse(object.data, safe=False)
        return JsonResponse({"message": "Not valid user id."}, safe=False)

    elif request.method == "POST":
        data = JSONParser().parse(request)
        serializer = serializers.LogsSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            user = models.CustomUsers.objects.get(pk=int(data["user"]))
            tense = models.Tenses.objects.get(pk=int(data["tense"]))
            user.points = int(user.points) + int(tense.points)
            user.save()

            return JsonResponse(
                {"content": serializer.data}, status=status.HTTP_202_ACCEPTED
            )
        return JsonResponse(
            {"message": "Not valid data!"}, status=status.HTTP_202_ACCEPTED
        )
