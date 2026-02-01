from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import LeaveReportStaff, LeaveReportStudent, FeedBackStaffs, FeedBackStudent, StudentResult
from .serializers import StaffLeaveSerializer, StudentLeaveSerializer, StaffFeedbackSerializer, StudentFeedbackSerializer,StudentResultSerializer

# --- LEAVE MANAGEMENT ---

class StaffLeaveAPIView(APIView):
    """View and Apply for Staff Leave"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        leaves = LeaveReportStaff.objects.filter(staff_id__admin=request.user)
        return Response(StaffLeaveSerializer(leaves, many=True).data)

    def post(self, request):
        data = request.data
        LeaveReportStaff.objects.create(
            staff_id_id=request.user.id,
            leave_date=data.get('leave_date'),
            leave_message=data.get('leave_message'),
            leave_status=0  # Pending
        )
        return Response({"message": "Leave applied"}, status=status.HTTP_201_CREATED)

class AdminLeaveActionAPIView(APIView):
    """HOD Approves or Rejects Leaves"""
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        leave_id = request.data.get('leave_id')
        leave_type = request.data.get('type') # 'staff' or 'student'
        new_status = request.data.get('status') # 1=Approve, 2=Reject

        if leave_type == 'staff':
            leave = LeaveReportStaff.objects.get(id=leave_id)
        else:
            leave = LeaveReportStudent.objects.get(id=leave_id)
        
        leave.leave_status = new_status
        leave.save()
        return Response({"message": "Leave status updated"})

# --- FEEDBACK MANAGEMENT ---

class FeedbackAPIView(APIView):
    """Handles Feedback for both Staff and Students"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        feedback_msg = request.data.get('feedback')
        
        if user.user_type == '2': # Staff
            FeedBackStaffs.objects.create(staff_id_id=user.id, feedback=feedback_msg, feedback_reply="")
        elif user.user_type == '3': # Student
            FeedBackStudent.objects.create(student_id_id=user.id, feedback=feedback_msg, feedback_reply="")
            
        return Response({"message": "Feedback submitted"})

# --- RESULTS MANAGEMENT ---

class StudentResultAPIView(APIView):
    """Student views their own results"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        results = StudentResult.objects.filter(student_id__admin=request.user)
        return Response(StudentResultSerializer(results, many=True).data)