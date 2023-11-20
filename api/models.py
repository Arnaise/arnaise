from django.db import models
from authentication.models import CustomUsers

# Create your models here.


class Tenses(models.Model):
    label = models.CharField(
        max_length=50,
        unique=True,
        help_text="Placeholder for user.",
        blank=False,
        null=False,
    )
    value = models.CharField(
        max_length=50,
        unique=True,
        help_text="Fixed parameter value that is required for library.",
        blank=False,
        null=False,
    )
    points = models.PositiveIntegerField(default=10)
    show = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Tenses"

    def __str__(self):
        return self.label


class Subjects(models.Model):
    label = models.CharField(
        max_length=50,
        unique=True,
        help_text="Placeholder for user.",
        blank=False,
        null=False,
    )
    value = models.CharField(
        max_length=50,
        help_text="Fixed parameter value that is required for library.",
        blank=False,
        null=False,
    )
    show = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Subjects"

    def __str__(self):
        return self.label


class Verbs(models.Model):
    value = models.CharField(
        max_length=50,
        help_text="Fixed parameter value that is required for library.",
        blank=False,
        null=False,
    )
    isRegular = models.BooleanField(blank=False, null=False)
    show = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Verbs"

    def __str__(self):
        return f"{self.value} - ({'Regular' if self.isRegular else 'Irregular'})"


class Logs(models.Model):
    user = models.ForeignKey(
        CustomUsers,
        on_delete=models.CASCADE,
    )
    tense = models.ForeignKey(
        Tenses,
        on_delete=models.CASCADE,
    )
    subject = models.ForeignKey(
        Subjects,
        on_delete=models.CASCADE,
    )
    verb = models.ForeignKey(
        Verbs,
        on_delete=models.CASCADE,
    )
    correctAnswer = models.CharField(
        max_length=50,
        help_text="Correct answer.",
    )
    answer = models.CharField(
        max_length=50,
        help_text="Your answer.",
    )
    isCorrect = models.BooleanField(default=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Logs"

    def __str__(self):
        return f"{self.correctAnswer} - {self.user.fullName}"


class Problem(models.Model):
    text = models.TextField(unique=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Problems"

    def __str__(self):
        return f"{self.text}"


class CustomPreset(models.Model):
    user = models.ForeignKey(
        CustomUsers,
        on_delete=models.CASCADE,
    )
    name = models.CharField(
        max_length=50, help_text="Preset name.", null=True, blank=True
    )
    tenses = models.ManyToManyField("Tenses", null=True, blank=True)
    regularVerbs = models.ManyToManyField(
        "Verbs", related_name="regular_preset", null=True, blank=True
    )
    irregularVerbs = models.ManyToManyField(
        "Verbs", related_name="irregular_preset", null=True, blank=True
    )

    def __str__(self):
        return f"Custom Preset for {self.user.username}"
