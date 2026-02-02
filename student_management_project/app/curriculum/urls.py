from django.urls import path
from .views import (
    StaffAttendanceStats, 
    GetStudentsForAttendance, 
    SaveAttendanceAPIView, 
    StudentAttendanceStats
)

urlpatterns = [
    path('staff-stats/', StaffAttendanceStats.as_view(), name='staff_attendance_stats'),
    path('get-students/', GetStudentsForAttendance.as_view(), name='get_students'),
    path('save-attendance/', SaveAttendanceAPIView.as_view(), name='save_attendance'),
    path('student-stats/', StudentAttendanceStats.as_view(), name='student_attendance_stats'),
]