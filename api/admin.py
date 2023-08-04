from django.contrib import admin
from . import models

# Register your models here.

admin.site.register(models.Action)
admin.site.register(models.Category)
admin.site.register(models.Measurement)
admin.site.register(models.Currency)
admin.site.register(models.Payment)
admin.site.register(models.Delivery)
admin.site.register(models.Contract)
admin.site.register(models.Origin)
admin.site.register(models.ListingDuration)

# Separate the Product in another section "Interactions"
admin.site.register(models.Product)
admin.site.register(models.ProductInteractions)
