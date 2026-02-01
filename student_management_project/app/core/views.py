from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework import permissions

from app.accounts.models import Students, Staffs
from app.curriculum.models import Subjects, Courses
from .models import ContactMessage
from .serializers import ContactSerializer

class AdminDashboardStats(APIView):
    """Provides the counts for the top 4 dashboard cards"""
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request):
        return Response({
            "student_count": Students.objects.count(),
            "staff_count": Staffs.objects.count(),
            "course_count": Courses.objects.count(),
            "subject_count": Subjects.objects.count(),
        })

class ContactCreateView(CreateAPIView):
    """Public API for anyone to send contact messages"""
    queryset = ContactMessage.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [permissions.AllowAny] # No login required to contact support