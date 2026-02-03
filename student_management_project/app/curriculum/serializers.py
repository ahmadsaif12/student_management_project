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
    
    course_details = CourseSerializer(source='course_id', read_only=True)
    staff_details = StaffSerializer(source='staff_id', read_only=True)

    class Meta:
        model = Subjects
        # Use the exact field names from models.py: course_id and staff_id
        fields = [
            'id', 'subject_name', 'course_id', 'staff_id', 
            'course_details', 'staff_details', 
            'created_at', 'updated_at'
        ]