from rest_framework import serializers
from .models import Attendance, AttendanceReport

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'

class AttendanceReportSerializer(serializers.ModelSerializer):
    name = serializers.ReadOnlyField(source='student_id.admin.get_full_name')
    student_id_val = serializers.ReadOnlyField(source='student_id.admin.id')

    class Meta:
        model = AttendanceReport
        fields = ['id', 'student_id_val', 'name', 'status']