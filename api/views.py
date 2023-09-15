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
from authentication.models import CustomUsers
from django.db.models import Sum, F, Case, When, IntegerField, BooleanField


def initialize_backend():
    try:
        # Check if admin exists
        admin_exists = CustomUsers.objects.filter(username="admin").exists()
        if not admin_exists:
            # Add admin user
            CustomUsers.objects.create_user(
                password="admin",
                username="admin",
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

# import random


# def bulk_create_users():
#     user_data = [
#         {
#             "username": f"user{i}",
#             "password": "password123",
#             "points": random.randint(
#                 0, 1000
#             ),  # Generate random points between 0 and 1000
#         }
#         for i in range(1, 21)
#     ]

#     created_users = CustomUsers.objects.bulk_create(
#         CustomUsers(**data) for data in user_data
#     )


# bulk_create_users()


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
            verb = models.Verbs.objects.get(pk=int(data["verb"]))
            finalPoints = int(tense.points)
            if verb.isRegular:
                finalPoints += 2
            else:
                finalPoints += 5
            user.points = int(user.points) + finalPoints
            user.save()

            return JsonResponse(
                {"content": serializer.data}, status=status.HTTP_202_ACCEPTED
            )
        return JsonResponse(
            {"message": "Not valid data!"}, status=status.HTTP_202_ACCEPTED
        )


@api_view(["POST", "GET"])
@permission_classes([])
@authentication_classes([])
def leaderboard(request):
    if request.method == "GET":
        leaderboard_query = (
            CustomUsers.objects.filter(is_superuser=False)
            .annotate(total_correct=Sum("logs__isCorrect", output_field=IntegerField()))
            .order_by("-points", "username")[:10]
        )
        leaderboard_data = []
        position = 1
        for entry in leaderboard_query:
            data = {
                "username": entry.username,
                "points": entry.points,
                "correct": entry.total_correct
                if entry.total_correct is not None
                else 0,
                "position": position if position is not None else 0,
            }
            leaderboard_data.append(data)
            position += 1
        return JsonResponse(leaderboard_data, safe=False)
    elif request.method == "POST":
        user_id = request.data.get("user_id")

        if user_id is not None:
            user = CustomUsers.objects.filter(pk=user_id, is_superuser=False).first()

            if user is not None:
                total_correct = models.Logs.objects.filter(user=user).aggregate(
                    total_correct=Sum("isCorrect")
                )["total_correct"]
                leaderboard_query = CustomUsers.objects.filter(
                    is_superuser=False
                ).order_by("-points")
                user_position = next(
                    (
                        position + 1
                        for position, entry in enumerate(leaderboard_query)
                        if entry.pk == user_id
                    ),
                    None,
                )

                user_data = {
                    "username": user.username,
                    "points": user.points,
                    "correct": total_correct if total_correct is not None else 0,
                    "position": user_position if user_position is not None else 0,
                }

                if user_data["position"] <= 10:
                    return JsonResponse(None, safe=False)

                return JsonResponse(user_data)
            else:
                return JsonResponse({"error": "User not found"}, status=404)
        else:
            return JsonResponse({"error": "user_id is required"}, status=400)


@api_view(["POST"])
@permission_classes([])
@authentication_classes([])
def problems(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        serializer = serializers.ProblemSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({"content": {}}, status=status.HTTP_202_ACCEPTED)
        return JsonResponse(
            {"message": "Not valid data!"}, status=status.HTTP_202_ACCEPTED
        )
