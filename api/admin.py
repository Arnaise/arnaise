from django.contrib import admin
from . import models

# Register your models here.

admin.site.register(models.Tenses)
admin.site.register(models.Subjects)
admin.site.register(models.Verbs)
admin.site.register(models.Logs)
admin.site.register(models.Problem)
admin.site.register(models.CustomPreset)
