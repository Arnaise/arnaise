from django.db import models
from authentication.models import CustomUsers

# Create your models here.


class Action(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Measurement(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name}"


class Currency(models.Model):
    name = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return self.name


class Payment(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Delivery(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Contract(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Origin(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class ListingDuration(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    by = models.ForeignKey(
        CustomUsers,
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=50, unique=True)
    action = models.ForeignKey(
        Action,
        on_delete=models.CASCADE,
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
    )
    quantity = models.IntegerField()
    measurement = models.ForeignKey(
        Measurement,
        on_delete=models.CASCADE,
    )
    price = models.IntegerField()
    currency = models.ForeignKey(
        Currency,
        on_delete=models.CASCADE,
    )
    payment = models.ForeignKey(
        Payment,
        on_delete=models.CASCADE,
    )
    delivery = models.ForeignKey(
        Delivery,
        on_delete=models.CASCADE,
    )
    contract = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
    )
    origin = models.ForeignKey(
        Origin,
        on_delete=models.CASCADE,
    )
    listingDuration = models.ForeignKey(
        ListingDuration,
        on_delete=models.CASCADE,
    )
    isPaidPromoted = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class ProductInteractions(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(
        CustomUsers,
        on_delete=models.CASCADE,
    )
    action = models.ForeignKey(
        Action,
        on_delete=models.CASCADE,
    )
    isCancelled = models.BooleanField(default=False)
    isEmail = models.BooleanField(default=False)
    isWait = models.BooleanField(default=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} - {self.user.fullName}"
