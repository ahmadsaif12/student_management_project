from django.db.models import Count
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from app.accounts.models import Students, Staffs
from app.curriculum.models import Courses, Subjects
from .models import *
from app.core.models import ContactMessage
from .serializers import *
from app.core.serializers import ContactSerializer

# --- 1. ADMIN DASHBOARD & ACTIONS ---

class DashboardChartDataAPIView(APIView):
    """Admin/HOD Dashboard: Top-level stats and charts."""
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        try:
            student_count = Students.objects.count()
            staff_count = Staffs.objects.count()
            
            return Response({
                "cards": {
                    "total_students": student_count,
                    "total_staffs": staff_count,
                    "total_courses": Courses.objects.count(),
                    "total_subjects": Subjects.objects.count(),
                    "total_feedback": FeedBackStudent.objects.count() + FeedBackStaffs.objects.count(),
                    "total_contacts": ContactMessage.objects.count()
                },
                "staff_student_chart": [
                    {"name": "Students", "value": student_count},
                    {"name": "Staffs", "value": staff_count}
                ],
                "course_distribution": list(Courses.objects.annotate(
                    value=Count('subjects')).values('course_name', 'value')),
                "last_updated": "400"
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class AdminLeaveActionAPIView(APIView):
    """HOD approves (1) or rejects (2) leave requests for both staff and students."""
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        try:
            leave_id = request.data.get('leave_id')
            leave_type = request.data.get('type')  # 'staff' or 'student'
            new_status = request.data.get('status')  # 1: Approved, 2: Rejected

            if leave_type == 'staff':
                leave = LeaveReportStaff.objects.get(id=leave_id)
            else:
                leave = LeaveReportStudent.objects.get(id=leave_id)
            
            leave.leave_status = new_status
            leave.save()
            return Response({"message": f"Leave status updated to {new_status}"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Leave record not found or invalid data"}, status=status.HTTP_404_NOT_FOUND)


# --- 2. STAFF DASHBOARD & LEAVE ---

class StaffHomeStats(APIView):
    """Staff Dashboard: Personalized stats and leave status."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not hasattr(request.user, 'staffs'):
            return Response({"error": "Staff profile not found."}, status=403)
            
        staff = request.user.staffs
        leaves = LeaveReportStaff.objects.filter(staff_id=staff)
        
        return Response({
            "cards": {
                "students_under_me": Students.objects.filter(course_id__subjects__staff_id=staff).distinct().count(),
                "total_leave_taken": leaves.count(),
                "total_subjects": Subjects.objects.filter(staff_id=staff).count(),
                "total_attendance_taken": 0, 
            },
            "leave_chart_data": [
                {"name": "Approved", "value": leaves.filter(leave_status=1).count()},
                {"name": "Pending", "value": leaves.filter(leave_status=0).count()},
                {"name": "Rejected", "value": leaves.filter(leave_status=2).count()},
            ],
            "last_updated": "400"
        })

@method_decorator(csrf_exempt, name='dispatch')
class StaffLeaveAPIView(APIView):
    """Staff apply for leave (POST) and view their own history (GET)."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not hasattr(request.user, 'staffs'):
            return Response({"error": "Staff profile not found."}, status=403)
        leaves = LeaveReportStaff.objects.filter(staff_id=request.user.staffs)
        return Response(StaffLeaveSerializer(leaves, many=True).data)

    def post(self, request):
        try:
            LeaveReportStaff.objects.create(
                staff_id=request.user.staffs,
                leave_date=request.data.get('leave_date'),
                leave_message=request.data.get('leave_message'),
                leave_status=0 
            )
            return Response({"message": "Leave applied successfully"}, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=400)


# --- 3. STUDENT DASHBOARD & RESULTS ---

class StudentHomeStats(APIView):
    """Student Dashboard: Subject overview and activity."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not hasattr(request.user, 'students'):
            return Response({"error": "Student profile not found"}, status=403)
            
        student = request.user.students
        return Response({
            "cards": {
                "total_subjects": Subjects.objects.filter(course_id=student.course_id).count(),
                "leave_applied": LeaveReportStudent.objects.filter(student_id=student).count(),
                "feedback_sent": FeedBackStudent.objects.filter(student_id=student).count(),
            },
            "attendance_stats": [{"name": "Present", "value": 0}, {"name": "Absent", "value": 0}],
            "last_updated": "300"
        })

class StudentResultAPIView(APIView):
    """Staff manage marks | Students view their report cards."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if hasattr(request.user, 'students'):
            results = StudentResult.objects.filter(student_id=request.user.students)
            return Response(StudentResultSerializer(results, many=True).data)
        return Response({"error": "Forbidden"}, status=403)

    def post(self, request):
        if not hasattr(request.user, 'staffs'):
            return Response({"error": "Staff only"}, status=403)
        
        result, created = StudentResult.objects.update_or_create(
            student_id_id=request.data.get('student_id'),
            subject_id_id=request.data.get('subject_id'),
            defaults={
                'subject_exam_marks': request.data.get('subject_exam_marks'),
                'subject_assignment_marks': request.data.get('subject_assignment_marks')
            }
        )
        return Response({"message": "Marks saved", "created": created})


# --- 4. FEEDBACK & COMMUNICATIONS ---

class FeedbackAPIView(APIView):
    """Handles submission (POST) and personal history (GET) for Staff/Students."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        msg = request.data.get('feedback')
        if not msg:
            return Response({"error": "Feedback text is required"}, status=400)
        try:
            if hasattr(user, 'staffs'): 
                FeedBackStaffs.objects.create(staff_id=user.staffs, feedback=msg)
            elif hasattr(user, 'students'): 
                FeedBackStudent.objects.create(student_id=user.students, feedback=msg)
            return Response({"message": "Feedback sent successfully"})
        except Exception as e:
            return Response({"error": str(e)}, status=400)

    def get(self, request):
        user = request.user
        data = []
        if hasattr(user, 'staffs'):
            feedbacks = FeedBackStaffs.objects.filter(staff_id=user.staffs).order_by('-created_at')
            data = [{"id": f.id, "feedback": f.feedback, "reply": f.feedback_reply, "date": f.created_at} for f in feedbacks]
        elif hasattr(user, 'students'):
            feedbacks = FeedBackStudent.objects.filter(student_id=user.students).order_by('-created_at')
            data = [{"id": f.id, "feedback": f.feedback, "reply": f.feedback_reply, "date": f.created_at} for f in feedbacks]
        
        return Response(data)

# app/operations/views.py

class AdminFeedbackView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        # Fetch both and label them for the React frontend
        student_fb = FeedBackStudent.objects.select_related('student_id__admin').all()
        staff_fb = FeedBackStaffs.objects.select_related('staff_id__admin').all()

        data = [
            {
                "id": f.id,
                "user": f.student_id.admin.get_full_name(),
                "message": f.feedback,
                "reply": f.feedback_reply,
                "type": "Student",
                "date": f.created_at
            } for f in student_fb
        ] + [
            {
                "id": f.id,
                "user": f.staff_id.admin.get_full_name(),
                "message": f.feedback,
                "reply": f.feedback_reply,
                "type": "Staff",
                "date": f.created_at
            } for f in staff_fb
        ]
        
        # Sort by latest date
        data.sort(key=lambda x: x['date'], reverse=True)
        return Response(data)

    def post(self, request):
        fb_id = request.data.get('id')
        reply = request.data.get('reply')
        user_type = request.data.get('type') # 'Student' or 'Staff'

        model = FeedBackStudent if user_type == "Student" else FeedBackStaffs
        try:
            fb = model.objects.get(id=fb_id)
            fb.feedback_reply = reply
            fb.save()
            return Response({"message": "Reply submitted"})
        except model.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
# --- 5. PUBLIC & LANDING ---

class ContactCreateView(CreateAPIView):
    """Landing page contact form."""
    queryset = ContactMessage.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [permissions.AllowAny]