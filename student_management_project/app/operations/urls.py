from django.urls import path
from .views import (
    DashboardChartDataAPIView,
    StaffHomeStats,
    StaffLeaveAPIView,
    AdminLeaveActionAPIView,
    FeedbackAPIView,
    AdminFeedbackView,
    StudentResultAPIView
)

urlpatterns = [
    path('dashboard-charts/', DashboardChartDataAPIView.as_view(), name='api_dashboard_charts'),
    
    # STAFF: Powers the Yellow Card and Leave Status Chart
    path('staff-home-stats/', StaffHomeStats.as_view(), name='api_staff_home_stats'),


    # --- LEAVE MANAGEMENT ---
    # STAFF: View own leaves or apply for a new one
    path('leave/staff/', StaffLeaveAPIView.as_view(), name='api_staff_leave'),
    
    # HOD: Approve or Reject staff/student leaves
    path('leave/action/', AdminLeaveActionAPIView.as_view(), name='api_leave_action'),
    

    # --- FEEDBACK MANAGEMENT ---
    # STAFF/STUDENT: Submit feedback
    path('feedback/', FeedbackAPIView.as_view(), name='api_feedback'),
    
    # HOD: View all feedback and send replies
    path('feedback/admin/', AdminFeedbackView.as_view(), name='api_admin_feedback'),
    

    # --- RESULTS MANAGEMENT ---
    # STUDENT: View own results
    path('result/student/', StudentResultAPIView.as_view(), name='api_student_result'),
]