from rest_framework import serializers
from .models import Courses, Subjects
from app.core.models import SessionYearModel
from app.accounts.serializers import StaffSerializer

class SessionYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionYearModel
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Courses
        fields = '__all__'

class SubjectSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    staff = StaffSerializer(read_only=True)
    class Meta:
        model = Subjects
        fields = '__all__'