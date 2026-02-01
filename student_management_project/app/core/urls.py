from django.urls import path
from .views import AdminDashboardStats,ContactCreateView

urlpatterns = [
    # Main stats for the HOD dashboard
    path('admin-stats/', AdminDashboardStats.as_view(), name='api_admin_stats'),
    path('contact/', ContactCreateView.as_view(), name='api_contact'),
]