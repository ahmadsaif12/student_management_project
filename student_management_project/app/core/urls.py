from django.urls import path
from .views import AdminDashboardStats

urlpatterns = [
    # Main stats for the HOD dashboard
    path('admin-stats/', AdminDashboardStats.as_view(), name='api_admin_stats'),
]