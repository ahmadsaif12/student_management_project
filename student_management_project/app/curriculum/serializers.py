from rest_framework import serializers
from .models import Courses, Subjects
from app.core.models import SessionYearModel
from app.accounts.models import CustomUser, Staffs

class SessionYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionYearModel
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Courses
        fields = '__all__'

class UserMinimalSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'full_name']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username

class SubjectSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course_id.course_name', read_only=True)
    staff_name = serializers.SerializerMethodField()
    staff_email = serializers.SerializerMethodField()

    class Meta:
        model = Subjects
        fields = [
            'id', 
            'subject_name', 
            'course_id',    
            'course_name',  
            'staff_id',    
            'staff_name',   
            'staff_email', 
            'created_at', 
            'updated_at'
        ]

    def get_staff_name(self, obj):
        """
        Robustly retrieves the name. 
        Works whether staff_id points to Staffs Profile or CustomUser.
        """
        staff = obj.staff_id
        if not staff:
            return "Pending Assignment"

        # If it's the Staffs model (which has an 'admin' field)
        if hasattr(staff, 'admin'):
            user = staff.admin
        else:
            # If it's already the CustomUser model
            user = staff
            
        return f"{user.first_name} {user.last_name}".strip() or user.username

    def get_staff_email(self, obj):
        """Safely retrieves email without attribute errors"""
        staff = obj.staff_id
        if not staff:
            return "N/A"

        if hasattr(staff, 'admin'):
            return staff.admin.email
        
        return getattr(staff, 'email', "N/A")