from rest_framework import status
from . import serializers
from . import models
from django.http.response import JsonResponse
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.parsers import JSONParser
from .helpers import send_forget_password_mail
from django.contrib.auth.hashers import check_password, make_password


@api_view(["POST"])
@permission_classes([])
@authentication_classes([])
def validate(request):
    if request.method == "POST":
        # VALIDATE A USER
        data = JSONParser().parse(request)
        Users = models.CustomUsers.objects.all()
        email = data["email"]
        password = data["password"]
        if email and password is not None:
            count = Users.filter(email=email).count()
            if count != 0:
                data = Users.filter(email=email).values("password").first()
                if (
                    check_password(password, data["password"])
                    or password == data["password"]
                ):
                    userData = Users.filter(email=email).first()
                    SerializedData = serializers.ViewUserSerializer(
                        userData, many=False
                    )
                    return JsonResponse(SerializedData.data, safe=False)
                else:
                    return JsonResponse({"message": "Incorrect password."}, safe=False)
            else:
                return JsonResponse(
                    {"message": "No account found."},
                    status=status.HTTP_200_OK,
                )
        return JsonResponse({"message": "empty"}, status=status.HTTP_200_OK)


@api_view(["POST", "PUT", "GET"])
@permission_classes([])
@authentication_classes([])
def user(request, pk=None):
    if request.method == "GET":
        # GET A USER BY ID
        if pk is None:
            return JsonResponse({"message": "No user id given!"}, safe=False)
        data = JSONParser().parse(request)
        instance = models.CustomUsers.objects.get(pk=int(pk))
        object = serializers.ViewUserSerializer(instance, many=False)
        return JsonResponse(object.data, safe=False)
    if request.method == "POST":
        # ADD A USER
        data = JSONParser().parse(request)
        serializer = serializers.CustomUserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            userData = models.CustomUsers.objects.filter(email=data["email"]).first()
            SerializedData = serializers.ViewUserSerializer(userData, many=False)
            return JsonResponse(SerializedData.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return JsonResponse(
            {"message": serializer.errors}, status=status.HTTP_202_ACCEPTED
        )
