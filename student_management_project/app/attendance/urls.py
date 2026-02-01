from django.urls import path
from .views import (
    StaffAttendanceStats,
    StudentAttendanceStats,
    GetStudentsForAttendance,
    SaveAttendanceAPIView
)

urlpatterns = [
    path('staff-stats/', StaffAttendanceStats.as_view(), name='api_staff_attendance_stats'),
    path('student-stats/', StudentAttendanceStats.as_view(), name='api_student_attendance_stats'),
    path('fetch-students/', GetStudentsForAttendance.as_view(), name='api_get_students'),
    path('save/', SaveAttendanceAPIView.as_view(), name='api_save_attendance'),
]