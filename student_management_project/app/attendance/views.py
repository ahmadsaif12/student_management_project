from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.authentication import SessionAuthentication
from django.db.models import Count
from django.shortcuts import get_object_or_404

# Model Imports
from app.accounts.models import Students, CustomUser
from app.core.models import SessionYearModel
from app.curriculum.models import Subjects
from .models import Attendance, AttendanceReport

# --- AUTHENTICATION HELPER ---
class UnsafeSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return 

# --- 1. DROPDOWN DATA VIEWS ---

class StaffSubjectList(APIView):
    """Returns subjects assigned to the logged-in staff for dropdowns."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        subjects = Subjects.objects.filter(staff_id=request.user)
        data = [{"id": s.id, "subject_name": s.subject_name} for s in subjects]
        return Response(data)

class SessionYearList(APIView):
    """Returns all session years for dropdowns."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        sessions = SessionYearModel.objects.all()
        data = [
            {"id": s.id, "session_start_year": s.session_start_year, "session_end_year": s.session_end_year} 
            for s in sessions
        ]
        return Response(data)

# --- 2. STAFF: ATTENDANCE CORE LOGIC ---

class GetStudentsForAttendance(APIView):
    """Fetches student list for a NEW attendance session (POST)."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        sub_id = request.data.get("subject")
        sess_id = request.data.get("session_year")
        course_id = Subjects.objects.filter(id=sub_id).values_list('course_id', flat=True).first()
        
        students = Students.objects.filter(course_id=course_id, session_year_id=sess_id).select_related('admin')
        data = [{"id": s.admin.id, "name": f"{s.admin.first_name} {s.admin.last_name}"} for s in students]
        return Response(data)

class GetAttendanceDataAPIView(APIView):
    """Fetches EXISTING attendance records for a specific date/subject (View/Update mode)."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        subject_id = request.data.get("subject_id")
        session_id = request.data.get("session_year_id")
        att_date = request.data.get("attendance_date")

        try:
            attendance = Attendance.objects.filter(
                subject_id_id=subject_id,
                session_year_id_id=session_id,
                attendance_date=att_date
            ).first()

            if not attendance:
                return Response([], status=status.HTTP_200_OK)

            reports = AttendanceReport.objects.filter(attendance_id=attendance).select_related('student_id__admin')
            data = [{
                "id": r.student_id.admin.id,
                "name": f"{r.student_id.admin.first_name} {r.student_id.admin.last_name}",
                "status": r.status
            } for r in reports]
            
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class SaveAttendanceAPIView(APIView):
    """Saves or Updates attendance records."""
    authentication_classes = [UnsafeSessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            student_data = request.data.get("student_ids")
            subject_id = request.data.get("subject_id")
            session_id = request.data.get("session_year_id")
            att_date = request.data.get("attendance_date")

            attendance, _ = Attendance.objects.get_or_create(
                subject_id_id=subject_id, 
                attendance_date=att_date, 
                session_year_id_id=session_id
            )
            
            for entry in student_data:
                student = Students.objects.get(admin_id=entry['id'])
                AttendanceReport.objects.update_or_create(
                    student_id=student, 
                    attendance_id=attendance,
                    defaults={'status': entry['status']}
                )
            return Response({"message": "Success"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

# --- 3. ANALYTICS & STATS ---

class StaffAttendanceStats(APIView):
    """Staff Dashboard: Total sessions and per-subject chart data."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        total_sessions = Attendance.objects.filter(subject_id__staff_id=request.user).count()
        subject_stats = Subjects.objects.filter(staff_id=request.user).annotate(
            count=Count('attendance')
        ).values('subject_name', 'count')
        return Response({"total_sessions": total_sessions, "chart_data": list(subject_stats)})

class StudentAttendanceStats(APIView):
    """Student Dashboard: Personal attendance percentages and breakdown."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            student = get_object_or_404(Students, admin=request.user)
            reports = AttendanceReport.objects.filter(student_id=student)
            
            present = reports.filter(status=True).count()
            total = reports.count()
            subjects = Subjects.objects.filter(course_id=student.course_id)
            
            breakdown = []
            for sub in subjects:
                sub_reports = reports.filter(attendance_id__subject_id=sub)
                sub_total = sub_reports.count()
                sub_present = sub_reports.filter(status=True).count()
                
                breakdown.append({
                    "subject": sub.subject_name,
                    "present": sub_present,
                    "total": sub_total,
                    "percent": round((sub_present / sub_total * 100), 2) if sub_total > 0 else 0
                })

            return Response({
                "overview": {
                    "present": present,
                    "absent": total - present,
                    "total": total,
                    "percent": round((present / total * 100), 2) if total > 0 else 0
                },
                "breakdown": breakdown
            })
        except Exception as e:
            return Response({"error": str(e)}, status=400)