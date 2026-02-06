from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.authentication import SessionAuthentication
from django.db.models import Count
from django.shortcuts import get_object_or_404

# Model Imports
from app.accounts.models import Students, Staffs
from app.core.models import SessionYearModel
from app.curriculum.models import Subjects
from .models import Attendance, AttendanceReport

class UnsafeSessionAuthentication(SessionAuthentication):
    """Bypasses CSRF for React development and testing."""
    def enforce_csrf(self, request):
        return 

# --- 1. METADATA & SELECTION FILTERS ---

class StaffSubjectList(APIView):
    """Returns subjects based on user type: Admin (All), Student (Course), Staff (Assigned)."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            user_type = str(request.user.user_type)
            if user_type == '1': # Admin
                subjects = Subjects.objects.all()
            elif user_type == '3': # Student
                student = get_object_or_404(Students, admin=request.user)
                subjects = Subjects.objects.filter(course_id=student.course_id)
            else: # Staff
                # Use request.user directly because Subjects links to CustomUser
                subjects = Subjects.objects.filter(staff_id=request.user)
            
            data = [{"id": s.id, "subject_name": s.subject_name} for s in subjects]
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class SessionYearList(APIView):
    """Returns all available academic sessions."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            sessions = SessionYearModel.objects.all()
            data = [{"id": s.id, "session_start_year": s.session_start_year, "session_end_year": s.session_end_year} for s in sessions]
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# --- 2. ATTENDANCE OPERATIONS ---

class GetStudentsForAttendance(APIView):
    """Loads student list for Staff to mark new attendance."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            sub_id = request.data.get("subject")
            sess_id = request.data.get("session_year")
            
            if not sub_id or not sess_id:
                return Response({"error": "Missing subject or session ID"}, status=status.HTTP_400_BAD_REQUEST)

            subject = get_object_or_404(Subjects, id=sub_id)
            
            students = Students.objects.filter(
                course_id=subject.course_id, 
                session_year_id=sess_id
            ).select_related('admin')
            
            data = [
                {
                    "id": s.admin.id, 
                    "name": s.admin.get_full_name() or s.admin.username
                } for s in students
            ]
            
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class SaveAttendanceAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            student_data = request.data.get("student_ids") 
            subject_id = request.data.get("subject_id")
            session_id = request.data.get("session_year_id")
            att_date = request.data.get("attendance_date")

            # Debugging: Print to Docker console
            print(f"Saving attendance for Subject: {subject_id}, Date: {att_date}")

            # 1. Get or Create the Main Attendance Header
            # We use _id suffix if the field is a ForeignKey in the model
            attendance, _ = Attendance.objects.get_or_create(
                subject_id_id=subject_id, 
                attendance_date=att_date, 
                session_year_id_id=session_id
            )
            
            # 2. Bulk update/create the reports
            for entry in student_data:
                # IMPORTANT: Ensure entry['id'] matches the admin_id in your Students model
                student = Students.objects.get(admin_id=entry['id'])
                AttendanceReport.objects.update_or_create(
                    student_id=student, 
                    attendance_id=attendance,
                    defaults={'status': entry['status']}
                )
                
            return Response({"message": "Attendance Saved"}, status=status.HTTP_201_CREATED)
            
        except Students.DoesNotExist as e:
            print(f"Student Search Error: {str(e)}")
            return Response({"error": "One or more student IDs are invalid"}, status=400)
        except Exception as e:
            print(f"SERVER ERROR: {str(e)}") # This will show in your web-1 terminal
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
# --- 3. SEARCH & STATISTICS (Unified Logic) ---

class GetAttendanceDataAPIView(APIView):
    """Unified Search for Admin/Staff to view existing records."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            subject_id = request.data.get("subject_id")
            session_id = request.data.get("session_year_id")
            att_date = request.data.get("attendance_date")

            if att_date: # Daily View
                attendance = Attendance.objects.filter(
                    subject_id_id=subject_id,
                    session_year_id_id=session_id,
                    attendance_date=att_date
                ).first()

                if not attendance: return Response([])

                reports = AttendanceReport.objects.filter(attendance_id=attendance).select_related('student_id__admin')
                data = [{
                    "id": r.student_id.admin.id,
                    "name": f"{r.student_id.admin.first_name} {r.student_id.admin.last_name}",
                    "status": r.status,
                    "percent": 100 if r.status else 0
                } for r in reports]
                return Response(data)

            else: # Stats View - Lifetime Count
                subject = get_object_or_404(Subjects, id=subject_id)
                students = Students.objects.filter(course_id=subject.course_id).select_related('admin')

                data = []
                for student in students:
                    reports = AttendanceReport.objects.filter(student_id=student, attendance_id__subject_id=subject_id)
                    total = reports.count()
                    present = reports.filter(status=True).count()
                    
                    data.append({
                        "id": student.admin.id,
                        "name": f"{student.admin.first_name} {student.admin.last_name}",
                        "present": present,
                        "total": total,
                        "percent": round((present / total * 100), 2) if total > 0 else 0
                    })
                return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# --- 4. ANALYTICS ---

class StaffAttendanceStats(APIView):
    """Provides session counts and chart data for Staff Dashboard."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            # Check if Staff record exists
            staff_profile = Staffs.objects.get(admin=request.user)
            
            # Total classes this staff member has taken
            total_sessions = Attendance.objects.filter(
                subject_id__staff_id=request.user
            ).count()
            
            # Breakdown per subject
            subject_stats = Subjects.objects.filter(staff_id=request.user).annotate(
                count=Count('attendance')
            ).values('subject_name', 'count')
            
            return Response({
                "total_sessions": total_sessions, 
                "chart_data": list(subject_stats)
            }, status=status.HTTP_200_OK)
            
        except Staffs.DoesNotExist:
            return Response({"error": "Staff profile not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class StudentAttendanceStats(APIView):
    """Calculates lifetime stats for the Student Dashboard."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            student = get_object_or_404(Students, admin=request.user)
            subjects = Subjects.objects.filter(course_id=student.course_id)
            reports = AttendanceReport.objects.filter(student_id=student)
            
            total_count = reports.count()
            present_count = reports.filter(status=True).count()

            breakdown = []
            for sub in subjects:
                sub_reports = reports.filter(attendance_id__subject_id=sub.id)
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
                    "total": total_count,
                    "present": present_count,
                    "percent": round((present_count / total_count * 100), 2) if total_count > 0 else 0
                },
                "breakdown": breakdown
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)