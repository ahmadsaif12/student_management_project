from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db.models import Count
from app.accounts.models import Students
from app.curriculum.models import Subjects
from app.core.models import SessionYearModel
from app.attendance.models import Attendance, AttendanceReport

# --- STAFF DASHBOARD VIEWS ---

class StaffAttendanceStats(APIView):
    """
    Powers Staff Dashboard:
    - Green Card: Total Attendance sessions taken by this staff.
    - Bar Chart: 'Subjects Attend Chart' showing sessions per subject.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            # 1. Total Attendance Taken (Green Card)
            total_attendance = Attendance.objects.filter(subject_id__staff_id=request.user).count()
            
            # 2. Subjects Attend Chart
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
    """STAFF: Fetches list of students for the 'Take Attendance' sheet"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        subject_id = request.data.get("subject")
        session_year_id = request.data.get("session_year")
        
        try:
            subject = Subjects.objects.get(id=subject_id)
            session = SessionYearModel.objects.get(id=session_year_id)
            
            # Fetch students in the specific course and session
            students = Students.objects.filter(course_id=subject.course_id, session_year_id=session)
            data = [{"id": s.admin.id, "name": f"{s.admin.first_name} {s.admin.last_name}"} for s in students]
            return Response(data)
        except Exception:
            return Response({"error": "Data mapping error"}, status=status.HTTP_404_NOT_FOUND)

class SaveAttendanceAPIView(APIView):
    """STAFF: Bulk saves attendance from the React form"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        student_ids = request.data.get("student_ids") # Expects: [{"id": 1, "status": true}, ...]
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
            return Response({"message": "Attendance Saved Successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# --- STUDENT DASHBOARD VIEWS ---

class StudentAttendanceStats(APIView):
    """
    Powers Student Dashboard (Screenshot 1 & 4):
    - Top Cards: Total, Present, Absent, Total Subjects.
    - Bar Chart: 'Attendance Statistics by Subjects'.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            student = request.user.students
            reports = AttendanceReport.objects.filter(student_id=student)
            
            # 1. Core Card Counts
            total_attendance = reports.count()
            present = reports.filter(status=True).count()
            absent = reports.filter(status=False).count()
            total_subjects = Subjects.objects.filter(course_id=student.course_id).count()

            # 2. Per-Subject Bar Chart Logic
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
                    "total": total_attendance, 
                    "present": present, 
                    "absent": absent, 
                    "subjects": total_subjects
                },
                "subject_stats": subject_data
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class StaffCurriculumStats(APIView):
    """Placeholder for Curriculum Statistics"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Add your logic for curriculum stats here
        return Response({"message": "Curriculum stats logic goes here"})
# Add these to the end of your existing views.py

class StaffSubjectList(APIView):
    """STAFF: Returns a list of subjects assigned to the logged-in staff"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        subjects = Subjects.objects.filter(staff_id=request.user)
        data = [{"id": s.id, "subject_name": s.subject_name} for s in subjects]
        return Response(data)

class AllCurriculumData(APIView):
    """General view for curriculum metadata"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Placeholder logic
        return Response({"message": "Curriculum data list"})