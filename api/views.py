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
        if models.Action.objects.count() == 0:
            models.Action.objects.bulk_create(
                [models.Action(name=value) for value in constants.ACTIONS]
            )
            print("[INITIALIZATION][SUCCESS]: ACTIONS populated")
        else:
            print("[INITIALIZATION][EXISTS]: ACTIONS already populated")

        if models.Category.objects.count() == 0:
            models.Category.objects.bulk_create(
                [models.Category(name=value) for value in constants.CATEGORIES]
            )
            print("[INITIALIZATION][SUCCESS]: CATEGORIES populated")
        else:
            print("[INITIALIZATION][EXISTS]: CATEGORIES already populated")

        if models.Measurement.objects.count() == 0:
            models.Measurement.objects.bulk_create(
                [models.Measurement(name=value) for value in constants.MEASUREMENTS]
            )
            print("[INITIALIZATION][SUCCESS]: MEASUREMENTS populated")
        else:
            print("[INITIALIZATION][EXISTS]: MEASUREMENTS already populated")

        if models.Currency.objects.count() == 0:
            models.Currency.objects.bulk_create(
                [models.Currency(name=value) for value in constants.CURRENCIES]
            )
            print("[INITIALIZATION][SUCCESS]: CURRENCIES populated")
        else:
            print("[INITIALIZATION][EXISTS]: CURRENCIES already populated")

        if models.Payment.objects.count() == 0:
            models.Payment.objects.bulk_create(
                [models.Payment(name=value) for value in constants.PAYMENTS]
            )
            print("[INITIALIZATION][SUCCESS]: PAYMENTS populated")
        else:
            print("[INITIALIZATION][EXISTS]: PAYMENTS already populated")

        if models.Delivery.objects.count() == 0:
            models.Delivery.objects.bulk_create(
                [models.Delivery(name=value) for value in constants.DELIVERIES]
            )
            print("[INITIALIZATION][SUCCESS]: DELIVERIES populated")
        else:
            print("[INITIALIZATION][EXISTS]: DELIVERIES already populated")

        if models.Origin.objects.count() == 0:
            models.Origin.objects.bulk_create(
                [models.Origin(name=value) for value in constants.ORIGINS]
            )
            print("[INITIALIZATION][SUCCESS]: ORIGINS populated")
        else:
            print("[INITIALIZATION][EXISTS]: ORIGINS already populated")

        if models.Contract.objects.count() == 0:
            models.Contract.objects.bulk_create(
                [models.Contract(name=value) for value in constants.CONTRACTS]
            )
            print("[INITIALIZATION][SUCCESS]: CONTRACTS populated")
        else:
            print("[INITIALIZATION][EXISTS]: CONTRACTS already populated")

        if models.ListingDuration.objects.count() == 0:
            models.ListingDuration.objects.bulk_create(
                [
                    models.ListingDuration(name=value)
                    for value in constants.LISTING_DURATIONS
                ]
            )
            print("[INITIALIZATION][SUCCESS]: LISTING_DURATIONS populated")
        else:
            print("[INITIALIZATION][EXISTS]: LISTING_DURATIONS already populated")

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

        # Serialize Action objects
        actions = models.Action.objects.all()
        actions_serializer = serializers.ActionSerializer(actions, many=True)
        options_data["actions"] = actions_serializer.data

        # Serialize Category objects
        categories = models.Category.objects.all()
        categories_serializer = serializers.CategorySerializer(categories, many=True)
        options_data["categories"] = categories_serializer.data

        # Serialize Measurement objects
        measurements = models.Measurement.objects.all()
        measurements_serializer = serializers.MeasurementSerializer(
            measurements, many=True
        )
        options_data["measurements"] = measurements_serializer.data

        # Serialize Currency objects
        currencies = models.Currency.objects.all()
        currencies_serializer = serializers.CurrencySerializer(currencies, many=True)
        options_data["currencies"] = currencies_serializer.data

        # Serialize Payment objects
        payments = models.Payment.objects.all()
        payments_serializer = serializers.PaymentSerializer(payments, many=True)
        options_data["payments"] = payments_serializer.data

        # Serialize Delivery objects
        deliveries = models.Delivery.objects.all()
        deliveries_serializer = serializers.DeliverySerializer(deliveries, many=True)
        options_data["deliveries"] = deliveries_serializer.data

        # Serialize Contract objects
        contracts = models.Contract.objects.all()
        contracts_serializer = serializers.ContractSerializer(contracts, many=True)
        options_data["contracts"] = contracts_serializer.data

        # Serialize Origin objects
        origins = models.Origin.objects.all()
        origins_serializer = serializers.OriginSerializer(origins, many=True)
        options_data["origins"] = origins_serializer.data

        # Serialize ListingDuration objects
        listing_durations = models.ListingDuration.objects.all()
        listing_durations_serializer = serializers.ListingDurationSerializer(
            listing_durations, many=True
        )
        options_data["listing_durations"] = listing_durations_serializer.data

        return JsonResponse(options_data)
    if request.method == "POST":
        # Serialize Category objects
        categories = models.Category.objects.all()
        categories_serializer = serializers.CategorySerializer(categories, many=True)
        return JsonResponse(categories_serializer.data, safe=False)


from datetime import datetime, timedelta


def is_product_expired(activation_timestamp, expiration_days):
    activation_date = datetime.fromisoformat(activation_timestamp)
    expiration_date = activation_date + timedelta(days=int(expiration_days.split()[0]))
    current_date = datetime.now()
    return current_date >= expiration_date


@api_view(["POST", "GET"])
@permission_classes([])
@authentication_classes([])
def products(request, pk=None):
    if request.method == "GET":
        instance = models.Product.objects.all().order_by("-timestamp")
        final_data = serializers.ViewProductSerializer(instance, many=True).data
        output = []
        for data in final_data:
            if not is_product_expired(
                data["timestamp"], data["listingDuration"]["name"]
            ):
                if pk is not None:
                    lastObject = (
                        models.ProductInteractions.objects.filter(
                            user__id=pk, product__id=data["id"]
                        )
                        .order_by("-timestamp")
                        .first()
                    )
                else:
                    lastObject = None

                data["lastActivity"] = (
                    serializers.HomeProductInteractionsSerializer(lastObject).data
                    if lastObject is not None
                    else None
                )
                output.append(data)

        return JsonResponse(output, safe=False)
    if request.method == "POST":
        # ADD A PRODUCT
        data = JSONParser().parse(request)
        serializer = serializers.ProductSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            email_new_listing(
                serializers.ViewProductSerializer(
                    models.Product.objects.get(pk=serializer.data["id"])
                ).data
            )
            return JsonResponse(
                {"content": serializer.data}, status=status.HTTP_202_ACCEPTED
            )
        return JsonResponse(
            {"message": "Not valid data!"}, status=status.HTTP_202_ACCEPTED
        )


@api_view(["POST", "PUT", "GET"])
@permission_classes([])
@authentication_classes([])
def interactions(request, pk=None):
    if request.method == "GET":
        try:
            instance = models.ProductInteractions.objects.all()
            if pk is not None:
                instance = instance.get(pk=int(pk))
            object = serializers.ViewProductInteractionsSerializer(
                instance, many=(pk is None)
            )
            return JsonResponse(object.data, safe=False)
        except:
            return JsonResponse({"message": "Not valid id!"}, safe=False)
    if request.method == "POST":
        # ADD A PRODUCT INTERACTION
        data = JSONParser().parse(request)
        serializer = serializers.ProductInteractionsSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(
                {"content": serializer.data}, status=status.HTTP_202_ACCEPTED
            )
        return JsonResponse(
            {"message": "Not valid data!"}, status=status.HTTP_202_ACCEPTED
        )
    if request.method == "PUT":
        # CANCEL A PRODUCT INTERACTION
        data = JSONParser().parse(request)
        try:
            if data["id"] is not None:
                instance = models.ProductInteractions.objects.get(pk=int(data["id"]))
                instance.isCancelled = True
                instance.save()
                return JsonResponse({}, safe=False)
            else:
                return JsonResponse({"message": "Provide proper id!"}, safe=False)
        except Exception as e:
            print(e)
            return JsonResponse({"message": "Not valid ids!"}, safe=False)
