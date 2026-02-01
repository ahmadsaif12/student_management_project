from rest_framework.views import APIView
from rest_framework.response import Response
from app.accounts.models import Students
from app.curriculum.models import Subjects
from app.core.models import SessionYearModel
from .models import Attendance, AttendanceReport

class GetStudentsForAttendance(APIView):
    def post(self, request):
        subject_id = request.data.get("subject")
        session_year_id = request.data.get("session_year")
        
        subject = Subjects.objects.get(id=subject_id)
        session = SessionYearModel.objects.get(id=session_year_id)
        
        students = Students.objects.filter(course_id=subject.course_id, session_year_id=session)
        data = [{"id": s.admin.id, "name": f"{s.admin.first_name} {s.admin.last_name}"} for s in students]
        return Response(data)

class SaveAttendanceAPIView(APIView):
    def post(self, request):
        student_ids = request.data.get("student_ids") # Expects JSON array of {id, status}
        subject_id = request.data.get("subject_id")
        attendance_date = request.data.get("attendance_date")
        session_year_id = request.data.get("session_year_id")

        try:
            attendance = Attendance.objects.create(
                subject_id_id=subject_id,
                attendance_date=attendance_date,
                session_year_id_id=session_year_id
            )
            for stud in student_ids:
                student = Students.objects.get(admin_id=stud['id'])
                AttendanceReport.objects.create(
                    student_id=student,
                    attendance_id=attendance,
                    status=stud['status']
                )
            return Response({"message": "Attendance Saved Successfully"}, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=400)