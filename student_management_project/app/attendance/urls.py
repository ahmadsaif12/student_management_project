from django.urls import path
from .views import GetStudentsForAttendance, SaveAttendanceAPIView

urlpatterns = [
    # Replaces 'get_students' - Fetches student list for the attendance sheet
    path('fetch-students/', GetStudentsForAttendance.as_view(), name='api_get_students'),
    
    # Replaces 'save_attendance_data' - Saves the bulk attendance records
    path('save/', SaveAttendanceAPIView.as_view(), name='api_save_attendance'),
]