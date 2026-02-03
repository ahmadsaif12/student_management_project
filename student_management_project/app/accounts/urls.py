from django.urls import path, include # Added include
from rest_framework.routers import DefaultRouter
from .views import (
    LoginAPIView, RegistrationAPIView, LogoutAPIView, 
    ProfileAPIView, StaffListAPIView, StudentViewSet,StaffDetailAPIView
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
    path('', include(router.urls)), 
]