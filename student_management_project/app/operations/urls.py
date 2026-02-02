from django.urls import path
from .views import (
    DashboardChartDataAPIView,
    StaffHomeStats,
    StudentHomeStats,
    StaffLeaveAPIView,
    AdminLeaveActionAPIView,
    FeedbackAPIView,
    StudentResultAPIView,
    ContactCreateView
)

urlpatterns = [
    # --- DASHBOARDS (Stats for Charts & Cards) ---
    path('admin-dashboard-stats/', DashboardChartDataAPIView.as_view(), name='api_admin_dashboard'),
    path('staff-dashboard-stats/', StaffHomeStats.as_view(), name='api_staff_dashboard'),
    path('student-dashboard-stats/', StudentHomeStats.as_view(), name='api_student_dashboard'),

    # --- LEAVE MANAGEMENT ---
    # Staff apply/view history
    path('leave/staff/', StaffLeaveAPIView.as_view(), name='api_staff_leave'),
    # Admin approves or rejects
    path('leave/action/', AdminLeaveActionAPIView.as_view(), name='api_leave_action'),

    # --- FEEDBACK & RESULTS ---
    path('feedback/submit/', FeedbackAPIView.as_view(), name='api_feedback_submit'),
    path('manage-results/', StudentResultAPIView.as_view(), name='api_manage_results'),

    # --- PUBLIC SERVICES ---
    path('contact/send/', ContactCreateView.as_view(), name='api_contact_send'),
]