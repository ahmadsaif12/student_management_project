from rest_framework.views import APIView
from rest_framework.response import Response
from app.accounts.models import Students, Staffs
from app.curriculum.models import Subjects, Courses

class AdminDashboardStats(APIView):
    def get(self, request):
        return Response({
            "student_count": Students.objects.count(),
            "staff_count": Staffs.objects.count(),
            "course_count": Courses.objects.count(),
            "subject_count": Subjects.objects.count(),
        })