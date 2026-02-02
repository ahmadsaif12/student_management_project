from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.authentication import SessionAuthentication
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Count

from app.accounts.models import Students
from app.curriculum.models import Subjects
from app.core.models import SessionYearModel
from .models import Attendance, AttendanceReport

# --- HELPER FOR CSRF ---
class UnsafeSessionAuthentication(SessionAuthentication):
    """Disables CSRF check for SessionAuth to allow React/Postman testing"""
    def enforce_csrf(self, request):
        return 

# --- STAFF VIEWS ---

class StaffAttendanceStats(APIView):
    """
    STAFF DASHBOARD:
    - Green Card: Total sessions conducted by this staff.
    - Bar Chart: Attendance count per subject assigned to this staff.
    """
    authentication_classes = [UnsafeSessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            # 1. Green Card: Count sessions where this staff is the teacher
            total_attendance = Attendance.objects.filter(subject_id__staff_id=request.user).count()
            
            # 2. Subjects Chart: Grouping sessions by subject name
            subject_stats = Subjects.objects.filter(staff_id=request.user).annotate(
                attendance_count=Count('attendance')
            ).values('subject_name', 'attendance_count')
            
            return Response({
                "total_attendance_taken": total_attendance,
                "subject_list": list(subject_stats)
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class GetStudentsForAttendance(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            sub_id = int(request.data.get("subject"))
            sess_id = int(request.data.get("session_year"))
            subject_course_id = Subjects.objects.filter(id=sub_id).values_list('course_id_id', flat=True).first()
            
            students = Students.objects.filter(
                course_id_id=subject_course_id,
                session_year_id_id=sess_id
            ).select_related('admin')

            data = []
            for s in students:
                data.append({
                    "id": s.admin.id,
                    "name": f"{s.admin.first_name} {s.admin.last_name}"
                })
            
            print(f"DEBUG: Found {len(data)} students")
            return Response(data)
            
        except Exception as e:
            return Response({"error": str(e)}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class SaveAttendanceAPIView(APIView):
    """STAFF: Bulk saves attendance from the React dynamic form"""
    authentication_classes = [UnsafeSessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        student_ids = request.data.get("student_ids") # [{"id": 1, "status": true}, ...]
        subject_id = request.data.get("subject_id")
        attendance_date = request.data.get("attendance_date")
        session_year_id = request.data.get("session_year_id")

        try:
            # Create the main Attendance session
            attendance = Attendance.objects.create(
                subject_id_id=subject_id, 
                attendance_date=attendance_date, 
                session_year_id_id=session_year_id
            )
            
            # Bulk create student reports
            for stud in student_ids:
                student = Students.objects.get(admin_id=stud['id'])
                AttendanceReport.objects.create(
                    student_id=student, 
                    attendance_id=attendance, 
                    status=stud['status']
                )
            return Response({"message": "Attendance Saved Successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# --- STUDENT VIEWS ---

@method_decorator(csrf_exempt, name='dispatch')
class StudentAttendanceStats(APIView):
    """
    STUDENT DASHBOARD:
    - Cards: Total, Present, Absent, Total Subjects.
    - Chart: Attendance per subject.
    """
    authentication_classes = [UnsafeSessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            student = request.user.students
            reports = AttendanceReport.objects.filter(student_id=student)
            
            total_attendance = reports.count()
            present = reports.filter(status=True).count()
            absent = reports.filter(status=False).count()
            total_subjects = Subjects.objects.filter(course_id=student.course_id).count()

            subjects = Subjects.objects.filter(course_id=student.course_id)
            subject_data = []
            for sub in subjects:
                sub_reports = reports.filter(attendance_id__subject_id=sub)
                subject_data.append({
                    "subject": sub.subject_name,
                    "present": sub_reports.filter(status=True).count(),
                    "absent": sub_reports.filter(status=False).count(),
                })

            return Response({
                "cards": {
                    "total_attendance": total_attendance, 
                    "present": present, 
                    "absent": absent, 
                    "total_subjects": total_subjects
                },
                "subject_stats": subject_data
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)