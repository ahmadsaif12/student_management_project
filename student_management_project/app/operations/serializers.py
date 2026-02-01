from rest_framework import serializers
from .models import LeaveReportStaff, LeaveReportStudent, FeedBackStaffs, FeedBackStudent, StudentResult
# Ensure this matches your project structure
from app.accounts.serializers import StaffSerializer, StudentSerializer 

class StaffLeaveSerializer(serializers.ModelSerializer):
    # This allows React to see staff names, not just IDs
    staff_details = StaffSerializer(source='staff_id', read_only=True)

    class Meta:
        model = LeaveReportStaff
        fields = '__all__'

class StudentLeaveSerializer(serializers.ModelSerializer):
    student_details = StudentSerializer(source='student_id', read_only=True)

    class Meta:
        model = LeaveReportStudent
        fields = '__all__'

class StaffFeedbackSerializer(serializers.ModelSerializer):
    staff_details = StaffSerializer(source='staff_id', read_only=True)

    class Meta:
        model = FeedBackStaffs
        fields = '__all__'

class StudentFeedbackSerializer(serializers.ModelSerializer):
    student_details = StudentSerializer(source='student_id', read_only=True)

    class Meta:
        model = FeedBackStudent
        fields = '__all__'

class StudentResultSerializer(serializers.ModelSerializer):
    student_details = StudentSerializer(source='student_id', read_only=True)

    class Meta:
        model = StudentResult
        fields = '__all__'