from django.contrib.auth.models import Group
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from . import models

# Register your models here.


class UserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Additional Info", {"fields": ("points",)}),  # Add points field here
    )
    list_display = ("username", "points", "is_admin")
    list_filter = ("is_staff", "is_superuser", "is_active")
    search_fields = ("username",)
    ordering = ("username",)

    def is_admin(self, obj):
        return obj.is_staff

    is_admin.short_description = "Is Admin"


admin.site.register(models.CustomUsers, UserAdmin)


admin.site.site_header = "Admin Panel"
admin.site.site_title = "Admin Panel"
admin.site.index_title = "Admin Panel"


# Hide AUTHENTICATION AND AUTHORIZATION

# from django.contrib.auth.models import User

# admin.site.unregister(User)
admin.site.unregister(Group)
