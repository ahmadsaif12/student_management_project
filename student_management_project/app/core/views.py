from django.db.models import Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

from app.accounts.models import Students, Staffs
from app.curriculum.models import Courses, Subjects
from app.operations.models import (
    FeedBackStudent, 
    FeedBackStaffs, 
   
)
from .models import ContactMessage

class AdminDashboardStats(APIView):
    
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request):
        try:
            student_count = Students.objects.count()
            staff_count = Staffs.objects.count()
            course_count = Courses.objects.count()
            subject_count = Subjects.objects.count()

            # 2. MIDDLE ROW CHARTS
            # Pie Chart: Student and Staff Chart
            staff_student_chart = [
                {"name": "Students", "value": student_count},
                {"name": "Staffs", "value": staff_count}
            ]

            # Donut Chart: Total Subjects in Each Course
            course_subject_distribution = list(Courses.objects.annotate(
                value=Count('subjects')
            ).values('course_name', 'value'))

            # Total Student in Each Course
            course_student_distribution = list(Courses.objects.annotate(
                value=Count('students')
            ).values('course_name', 'value'))

            # Total Students in Each Subject
            subject_student_distribution = list(Subjects.objects.annotate(
                value=Count('studentresult__student_id', distinct=True)
            ).values('subject_name', 'value'))

            return Response({
                "cards": {
                    "total_students": student_count,
                    "total_staffs": staff_count,
                    "total_courses": course_count,
                    "total_subjects": subject_count,
                    "total_feedback": FeedBackStudent.objects.count() + FeedBackStaffs.objects.count(),
                    "total_contacts": ContactMessage.objects.count(),
                },
                "charts": {
                    "staff_student_ratio": staff_student_chart,
                    "subjects_per_course": course_subject_distribution,
                    "students_per_course": course_student_distribution,
                    "students_per_subject": subject_student_distribution
                },
                "last_updated": "400" 
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": f"Dashboard Error: {str(e)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )