from django.urls import path
from .views import (
    StaffAttendanceStats,
    StudentAttendanceStats,
    GetStudentsForAttendance,
    SaveAttendanceAPIView,
    GetAttendanceDataAPIView,
    StaffSubjectList,  
    SessionYearList   
)

urlpatterns = [
    # --- Analytics & Stats ---
    path('staff-stats/', StaffAttendanceStats.as_view(), name='api_staff_attendance_stats'),
    path('student-stats/', StudentAttendanceStats.as_view(), name='api_student_attendance_stats'),

    # --- Dropdown Data (The fix for your empty dropdowns) ---
    path('staff-subjects/', StaffSubjectList.as_view(), name='api_staff_subjects'),
    path('sessions/', SessionYearList.as_view(), name='api_sessions_list'),

    # --- Attendance Operations ---
    path('fetch-students/', GetStudentsForAttendance.as_view(), name='api_get_students'),
    path('save/', SaveAttendanceAPIView.as_view(), name='api_save_attendance'),
    path('fetch-data/', GetAttendanceDataAPIView.as_view(), name='api_get_attendance_data'),
]