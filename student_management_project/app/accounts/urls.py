from django.urls import path, include # Added include
from rest_framework.routers import DefaultRouter
from .views import (
    LoginAPIView, RegistrationAPIView, LogoutAPIView, 
    ProfileAPIView, StaffListAPIView, StudentViewSet,StaffDetailAPIView,StaffSubjectListAPIView, 
    SessionYearListAPIView
    # ... your other views
)

router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='students')

urlpatterns = [
    path('login/', LoginAPIView.as_view(), name='login'),
    path('register/', RegistrationAPIView.as_view(), name='register'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('profile/', ProfileAPIView.as_view()),
    path('staff/', StaffListAPIView.as_view(), name='staff-list'),
    path('staff/<int:pk>/', StaffDetailAPIView.as_view(), name='staff-detail-update-delete'),
    path('staff-subjects/', StaffSubjectListAPIView.as_view(), name='staff_subjects'),
    path('sessions/', SessionYearListAPIView.as_view(), name='sessions_list'),
    path('', include(router.urls)), 
]