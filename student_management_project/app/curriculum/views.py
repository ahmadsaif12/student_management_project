from rest_framework import generics, permissions
from .models import Courses, Subjects
from app.core.models import SessionYearModel
from .serializers import CourseSerializer, SubjectSerializer, SessionYearSerializer


class CourseListCreateView(generics.ListCreateAPIView):
    """Admin Dashboard: Powers the 'Total Courses' card and Course List."""
    queryset = Courses.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Manage Course: Edit or Delete courses."""
    queryset = Courses.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]


class SubjectListCreateView(generics.ListCreateAPIView):
    """
    Admin Dashboard: Powers 'Total Subjects' card.
    Staff Dashboard: Filters subjects assigned to the logged-in staff.
    """
    serializer_class = SubjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == '1':
            return Subjects.objects.all()
        return Subjects.objects.filter(staff_id=user)

class SubjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Manage Subject: Edit or Delete specific subjects."""
    queryset = Subjects.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [permissions.IsAuthenticated]

# --- SESSION VIEWS ---
class SessionListCreateView(generics.ListCreateAPIView):
    """Manage Session: Add/View academic years (2024-2025)."""
    queryset = SessionYearModel.objects.all()
    serializer_class = SessionYearSerializer
    permission_classes = [permissions.IsAuthenticated]