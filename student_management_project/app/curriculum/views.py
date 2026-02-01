from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Subjects, Courses
from app.core.models import SessionYearModel
from .serializers import SubjectSerializer, CourseSerializer,SessionYearSerializer

class StaffSubjectList(APIView):
    """Returns subjects assigned to the logged-in staff"""
    def get(self, request):
        subjects = Subjects.objects.filter(staff_id=request.user.id)
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data)

class AllCurriculumData(APIView):
    """HOD uses this to populate dropdowns in React"""
    def get(self, request):
        courses = Courses.objects.all()
        sessions = SessionYearModel.objects.all()
        return Response({
            "courses": CourseSerializer(courses, many=True).data,
            "sessions": SessionYearSerializer(sessions, many=True).data
        })