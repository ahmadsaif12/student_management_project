from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db.models import Count

from app.accounts.models import Students, Staffs
from app.curriculum.models import Courses
from .models import (
    LeaveReportStaff, LeaveReportStudent, 
    FeedBackStaffs, FeedBackStudent, StudentResult
)
from .serializers import (
    StaffLeaveSerializer, StudentLeaveSerializer, 
    StaffFeedbackSerializer, StudentFeedbackSerializer, 
    StudentResultSerializer
)

# --- DASHBOARD & ANALYTICS ---

class DashboardChartDataAPIView(APIView):
    """HOD Dashboard: Provides data for Staff vs Student pie chart and Course Distribution donut chart"""
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        try:
            student_count = Students.objects.count()
            staff_count = Staffs.objects.count()

            # Course Distribution for Donut Chart
            course_data = Courses.objects.annotate(
                value=Count('students') 
            ).values('course_name', 'value')

            return Response({
                "staff_student_chart": [
                    {"name": "Students", "value": student_count},
                    {"name": "Staffs", "value": staff_count}
                ],
                "course_distribution": list(course_data)
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class StaffHomeStats(APIView):
    """Staff Dashboard: Provides Yellow Card (Total Leave) and Leave Status Chart data"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            staff = request.user.staffs
            leaves = LeaveReportStaff.objects.filter(staff_id=staff)
            
            return Response({
                "total_leave_taken": leaves.count(),
                "leave_chart_data": [
                    {"name": "Approved", "value": leaves.filter(leave_status=1).count()},
                    {"name": "Pending", "value": leaves.filter(leave_status=0).count()},
                    {"name": "Rejected", "value": leaves.filter(leave_status=2).count()},
                ]
            })
        except AttributeError:
            return Response({"error": "Staff profile not found"}, status=status.HTTP_404_NOT_FOUND)

# --- LEAVE MANAGEMENT ---

class StaffLeaveAPIView(APIView):
    """Staff: View and Apply for Leave"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        leaves = LeaveReportStaff.objects.filter(staff_id__admin=request.user)
        return Response(StaffLeaveSerializer(leaves, many=True).data)

    def post(self, request):
        try:
            LeaveReportStaff.objects.create(
                staff_id=request.user.staffs,
                leave_date=request.data.get('leave_date'),
                leave_message=request.data.get('leave_message'),
                leave_status=0 
            )
            return Response({"message": "Leave applied successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class AdminLeaveActionAPIView(APIView):
    """HOD: Approve (1) or Reject (2) Leaves"""
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        leave_id = request.data.get('leave_id')
        leave_type = request.data.get('type') # 'staff' or 'student'
        new_status = request.data.get('status') 

        try:
            if leave_type == 'staff':
                leave = LeaveReportStaff.objects.get(id=leave_id)
            else:
                leave = LeaveReportStudent.objects.get(id=leave_id)
            
            leave.leave_status = new_status
            leave.save()
            return Response({"message": f"Status updated to {new_status}"})
        except Exception:
            return Response({"error": "Leave record not found"}, status=status.HTTP_404_NOT_FOUND)

# --- FEEDBACK MANAGEMENT ---

class FeedbackAPIView(APIView):
    """Staff/Student: Submit Feedback"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        msg = request.data.get('feedback')
        
        if user.user_type == '2': # Staff
            FeedBackStaffs.objects.create(staff_id=user.staffs, feedback=msg, feedback_reply="")
        elif user.user_type == '3': # Student
            FeedBackStudent.objects.create(student_id=user.students, feedback=msg, feedback_reply="")
            
        return Response({"message": "Feedback submitted successfully"})

class AdminFeedbackView(APIView):
    """HOD: Fetch all feedbacks and send replies"""
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        staff_feedback = FeedBackStaffs.objects.all()
        student_feedback = FeedBackStudent.objects.all()
        return Response({
            "staff_feedback": StaffFeedbackSerializer(staff_feedback, many=True).data,
            "student_feedback": StudentFeedbackSerializer(student_feedback, many=True).data
        })

    def post(self, request):
        feedback_id = request.data.get('id')
        feedback_type = request.data.get('type') # 'staff' or 'student'
        reply = request.data.get('reply')

        try:
            if feedback_type == 'staff':
                fb = FeedBackStaffs.objects.get(id=feedback_id)
            else:
                fb = FeedBackStudent.objects.get(id=feedback_id)
            
            fb.feedback_reply = reply
            fb.save()
            return Response({"message": "Reply sent successfully"})
        except Exception:
            return Response({"error": "Feedback record not found"}, status=status.HTTP_404_NOT_FOUND)

# --- RESULTS MANAGEMENT ---

class StudentResultAPIView(APIView):
    """Student: View personal exam results"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        results = StudentResult.objects.filter(student_id__admin=request.user)
        return Response(StudentResultSerializer(results, many=True).data)