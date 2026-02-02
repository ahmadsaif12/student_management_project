from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db.models import Count
from app.accounts.models import Students
from app.curriculum.models import Subjects
from app.core.models import SessionYearModel
from .models import Attendance, AttendanceReport

class StaffAttendanceStats(APIView):
    """
    STAFF DASHBOARD:
    - Green Card: Total sessions conducted by this staff.
    - Bar Chart: Attendance count per subject assigned to this staff.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            # 1. Green Card: Count all attendance sessions where this staff is the teacher
            total_attendance = Attendance.objects.filter(subject_id__staff_id=request.user).count()
            
            # 2. Subjects Attend Chart: Grouping sessions by subject name
            subject_stats = Subjects.objects.filter(staff_id=request.user).annotate(
                attendance_count=Count('attendance')
            ).values('subject_name', 'attendance_count')
            
            return Response({
                "total_attendance_taken": total_attendance,
                "subject_list": list(subject_stats)
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class StudentAttendanceStats(APIView):
    """
    STUDENT DASHBOARD 
    - Top Cards: Total, Present, Absent, Total Subjects.
    - Bar Chart: 'Attendance Statistics by Subjects'.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            student = request.user.students
            reports = AttendanceReport.objects.filter(student_id=student)
            
            # Data for the 4 colored cards
            total_attendance = reports.count()
            present = reports.filter(status=True).count()
            absent = reports.filter(status=False).count()
            total_subjects = Subjects.objects.filter(course_id=student.course_id).count()

            # Data for the "Attendance Statistics by Subjects" Bar Chart
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

class GetStudentsForAttendance(APIView):
    """STAFF: Fetches list of students for a specific subject and session to take attendance"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        subject_id = request.data.get("subject")
        session_year_id = request.data.get("session_year")
        try:
            subject = Subjects.objects.get(id=subject_id)
            session = SessionYearModel.objects.get(id=session_year_id)
            
            # Fetch students enrolled in the course that includes this subject
            students = Students.objects.filter(course_id=subject.course_id, session_year_id=session)
            
            data = [{"id": s.admin.id, "name": f"{s.admin.first_name} {s.admin.last_name}"} for s in students]
            return Response(data)
        except Exception:
            return Response({"error": "Subject or Session not found"}, status=status.HTTP_404_NOT_FOUND)

class SaveAttendanceAPIView(APIView):
    """STAFF: Bulk saves attendance from the React dynamic form"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        student_ids = request.data.get("student_ids") # Format: [{"id": 1, "status": true}, ...]
        subject_id = request.data.get("subject_id")
        attendance_date = request.data.get("attendance_date")
        session_year_id = request.data.get("session_year_id")

        try:
            # Create the main Attendance session record
            attendance = Attendance.objects.create(
                subject_id_id=subject_id, 
                attendance_date=attendance_date, 
                session_year_id_id=session_year_id
            )
            
            # Bulk create individual student reports
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