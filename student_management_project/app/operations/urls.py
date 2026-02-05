from django.urls import path
from .views import (
    DashboardChartDataAPIView,
    StaffHomeStats,
    StudentHomeStats,
    StaffLeaveAPIView,
    StudentLeaveAPIView,     
    AdminLeaveActionAPIView,
    AdminStudentLeaveView,  
    FeedbackAPIView,
    AdminFeedbackView,
    StudentResultAPIView,
    ContactCreateView
)

urlpatterns = [
    # --- DASHBOARDS ---
    path('admin-dashboard-stats/', DashboardChartDataAPIView.as_view(), name='api_admin_dashboard'),
    path('staff-dashboard-stats/', StaffHomeStats.as_view(), name='api_staff_dashboard'),
    path('student-dashboard-stats/', StudentHomeStats.as_view(), name='api_student_dashboard'),

    # --- LEAVE MANAGEMENT ---
    path('leave/staff/', StaffLeaveAPIView.as_view(), name='api_staff_leave'),
    path('leave/student/', StudentLeaveAPIView.as_view(), name='api_student_leave'), 
    
    # New: Admin view to see ALL student leave requests
    path('admin/student-leaves/', AdminStudentLeaveView.as_view(), name='admin_student_leaves'),
    
    # Admin approval/rejection logic
    path('leave/action/', AdminLeaveActionAPIView.as_view(), name='api_leave_action'),

    # --- FEEDBACK & COMMUNICATIONS ---
    path('feedback/', FeedbackAPIView.as_view(), name='api_feedback'),
    path('admin-feedback/', AdminFeedbackView.as_view(), name='api_admin_feedback'),

    # --- ACADEMICS & RESULTS ---
    path('manage-results/', StudentResultAPIView.as_view(), name='api_manage_results'),

    # --- PUBLIC SERVICES ---
    path('contact/send/', ContactCreateView.as_view(), name='api_contact_send'),
]