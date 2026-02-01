from django.urls import path
from .views import (
    StaffLeaveAPIView, 
    AdminLeaveActionAPIView, 
    FeedbackAPIView, 
    StudentResultAPIView
)

urlpatterns = [
    # Replaces: staff_apply_leave & staff_apply_leave_save
    path('leave/staff/', StaffLeaveAPIView.as_view(), name='api_staff_leave'),
    
    # Replaces: student_leave_view, student_leave_approve, student_leave_reject
    path('leave/action/', AdminLeaveActionAPIView.as_view(), name='api_leave_action'),
    
    # Replaces: staff_feedback_save & student_feedback_save
    path('feedback/', FeedbackAPIView.as_view(), name='api_feedback'),
    
    # Replaces: student_view_result
    path('result/student/', StudentResultAPIView.as_view(), name='api_student_result'),
]