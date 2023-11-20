from rest_framework import serializers
from . import models
from authentication.serializers import ViewUserSerializer


class TensesSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Tenses
        fields = "__all__"


class SubjectsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Subjects
        fields = "__all__"


class VerbsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Verbs
        fields = "__all__"


class LogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Logs
        fields = "__all__"


class ProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Problem
        fields = "__all__"


class LogsTensesSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Tenses
        fields = ["label", "points"]


class LogsSubjectsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Subjects
        fields = ["label"]


class LogsVerbsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Verbs
        fields = ["value", "isRegular"]


class ViewLogsSerializer(serializers.ModelSerializer):
    tense = LogsTensesSerializer()
    subject = LogsSubjectsSerializer()
    verb = LogsVerbsSerializer()
    points = serializers.SerializerMethodField()

    class Meta:
        model = models.Logs
        fields = "__all__"

    def get_points(self, obj):
        if not obj.isCorrect:
            return 0
        finalPoints = int(obj.tense.points)
        if obj.verb.isRegular:
            finalPoints += 2
        else:
            finalPoints += 5
        return finalPoints


class CustomPresetSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomPreset
        fields = "__all__"
