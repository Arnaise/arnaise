from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

# Create your models here.


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)  # hash the password
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class CustomUsers(AbstractUser):
    email = models.EmailField(max_length=256, unique=True)
    username = models.CharField(max_length=256, null=True, blank=True)
    fullName = models.CharField(max_length=256)
    countryCode = models.CharField(max_length=5)
    phoneNumber = models.CharField(max_length=20)
    password = models.CharField(max_length=2048)
    companyName = models.CharField(max_length=256, null=True, blank=True)
    companyURL = models.URLField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    class Meta:
        verbose_name_plural = "Users"

    def __str__(self):
        return self.email
