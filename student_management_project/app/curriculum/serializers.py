from rest_framework import serializers
from .models import Courses, Subjects
from app.core.models import SessionYearModel
from app.accounts.models import CustomUser

class SessionYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionYearModel
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Courses
        fields = '__all__'

# 1. This serializer targets CustomUser directly to avoid the Staff profile/gender crash
class UserMinimalSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'full_name']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

# 2. Updated Subject Serializer
class SubjectSerializer(serializers.ModelSerializer):
    # Use SerializerMethodField for course to prevent issues if course_id is null
    course_details = serializers.SerializerMethodField()
    
    # Use the minimal user serializer since your staff_id points to CustomUser
    staff_details = UserMinimalSerializer(source='staff_id', read_only=True)

    class Meta:
        model = Subjects
        fields = [
            'id', 'subject_name', 'course_id', 'staff_id', 
            'course_details', 'staff_details', 
            'created_at', 'updated_at'
        ]

    def get_course_details(self, obj):
        if obj.course_id:
            return {
                "id": obj.course_id.id,
                "course_name": obj.course_id.course_name
            }
        return None