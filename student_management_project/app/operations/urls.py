from django.urls import path
from .views import (
    DashboardChartDataAPIView,
    StaffHomeStats,
    StudentHomeStats,
    StaffLeaveAPIView,
    AdminLeaveActionAPIView,
    FeedbackAPIView,
    AdminFeedbackView,     # Added
    StudentResultAPIView,
    ContactCreateView
)

urlpatterns = [
    # --- DASHBOARDS (Stats for Charts & Cards) ---
    path('admin-dashboard-stats/', DashboardChartDataAPIView.as_view(), name='api_admin_dashboard'),
    path('staff-dashboard-stats/', StaffHomeStats.as_view(), name='api_staff_dashboard'),
    path('student-dashboard-stats/', StudentHomeStats.as_view(), name='api_student_dashboard'),

    # --- LEAVE MANAGEMENT ---
    path('leave/staff/', StaffLeaveAPIView.as_view(), name='api_staff_leave'),
    # Note: Ensure you have a StudentLeaveAPIView if students need to apply for leave
    path('leave/action/', AdminLeaveActionAPIView.as_view(), name='api_leave_action'),

    # --- FEEDBACK & COMMUNICATIONS ---
    # For Students/Staff to submit and view their own
    path('feedback/submit/', FeedbackAPIView.as_view(), name='api_feedback_submit'),
    # For Admin to view all and reply
    path('admin-feedback/', AdminFeedbackView.as_view(), name='api_admin_feedback'),

    # --- ACADEMICS & RESULTS ---
    path('manage-results/', StudentResultAPIView.as_view(), name='api_manage_results'),

    # --- PUBLIC SERVICES ---
    path('contact/send/', ContactCreateView.as_view(), name='api_contact_send'),
]