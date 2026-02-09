from django.contrib.auth import authenticate, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from rest_framework import status, permissions, generics, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import update_last_login 

from .models import *
from .serializers import *
from app.core.models import SessionYearModel
from app.curriculum.models import Subjects
from app.attendance.models import Attendance
from app.operations.models import LeaveReportStaff

# --- REGISTRATION ---
@method_decorator(csrf_exempt, name='dispatch')
class RegistrationAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        email = data.get('email')
        password = data.get('password')
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')
        
        if not email or not password:
            return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

        user_type = self.get_user_type_from_email(email)
        if not user_type:
            return Response({
                "error": "Invalid format. Email must include .hod, .staff, or .student before the @ (e.g., alex.staff@domain.com)"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        username = email.split('@')[0] 
        
        try:
            user = CustomUser.objects.create_user(
                username=username, 
                email=email, 
                password=password,
                first_name=first_name, 
                last_name=last_name, 
                user_type=user_type
            )
            
            if user_type == "1":
                AdminHOD.objects.get_or_create(admin=user)
            elif user_type == "2":
                Staffs.objects.get_or_create(admin=user, address="")
            elif user_type == "3":
                Students.objects.get_or_create(admin=user, address="", gender="")

            return Response({
                "message": "User registered successfully",
                "user_type": user_type
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get_user_type_from_email(self, email_id):
        try:
            role_part = email_id.split('@')[0].split('.')[1].lower()
            mapping = {'hod': '1', 'staff': '2', 'student': '3'}
            return mapping.get(role_part)
        except (IndexError, AttributeError):
            return None

@method_decorator(csrf_exempt, name='dispatch')
class LoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({"error": "Provide both email and password"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, email=email, password=password)

        if user:
            if user.is_active:
                # --- ADD THIS LINE HERE ---
                update_last_login(None, user) 
                
                refresh = RefreshToken.for_user(user)
                return Response({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user_type": user.user_type,
                    "user": UserSerializer(user).data,
                    "message": "Login Successful"
                }, status=status.HTTP_200_OK)
            return Response({"error": "Account disabled"}, status=status.HTTP_403_FORBIDDEN)
            
        return Response({"error": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)
# --- PROFILE & DASHBOARD ---
class ProfileAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            # --- STAFF DASHBOARD (Type 2) ---
            if user.user_type == '2':
                staff_profile = Staffs.objects.get(admin=user)
                subjects_count = Subjects.objects.filter(staff_id=user).count()
                students_count = Students.objects.filter(
                    course_id__subjects__staff_id=user
                ).distinct().count()
                attendance_count = Attendance.objects.filter(
                    subject_id__staff_id=user
                ).count()

                leave_count = LeaveReportStaff.objects.filter(staff_id=staff_profile).count()

                return Response({
                    "my_profile": StaffSerializer(staff_profile).data,
                    "cards": {
                        "students_under_me": students_count,
                        "total_attendance_taken": attendance_count,
                        "total_leave_taken": leave_count,
                        "total_subjects": subjects_count
                    },
                    "user_type": "2"
                })

            # --- ADMIN DASHBOARD (Type 1) ---
            elif user.user_type == '1':
                profile = AdminHOD.objects.get(admin=user)
                return Response({
                    "my_profile": AdminHODSerializer(profile).data,
                    "dashboard_stats": {
                        "total_students": Students.objects.count(),
                        "total_staffs": Staffs.objects.count(),
                    },
                    "user_type": "1"
                })
            elif user.user_type == '3':
                student_profile = Students.objects.get(admin=user)
                return Response({
                    "my_profile": StudentSerializer(student_profile).data,
                    "user_type": "3"
                })

            return Response({"error": "User type not recognized"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class StaffListAPIView(generics.ListAPIView): 
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        staff_members = Staffs.objects.select_related('admin').all()
        data = [
            {
                "id": s.admin.id,
                "full_name": s.admin.get_full_name() or s.admin.username,
                "email": s.admin.email
            } for s in staff_members
        ]
        return Response(data)
    
    def post(self, request): 
        serializer = StaffSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StaffDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StaffSerializer
    queryset = Staffs.objects.all()

# --- STUDENT MANAGEMENT ---
class StudentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StudentSerializer
    queryset = Students.objects.all().select_related('admin', 'course_id')

    def perform_destroy(self, instance):
        user = instance.admin
        instance.delete()
        user.delete()

# --- LOGOUT ---
class LogoutAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)


class StaffSubjectListAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            staff_profile = Staffs.objects.get(admin=request.user)
            
            subjects = Subjects.objects.filter(staff_id=request.user)
            
            data = [
                {
                    "id": s.id, 
                    "subject_name": s.subject_name
                } for s in subjects
            ]
            return Response(data, status=status.HTTP_200_OK)
            
        except Staffs.DoesNotExist:
            return Response({"error": "Staff record not found for this user."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
        
class SessionYearListAPIView(APIView):
    """Returns all available academic sessions."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        sessions = SessionYearModel.objects.all()
        data = [{
            "id": s.id, 
            "session_start_year": s.session_start_year, 
            "session_end_year": s.session_end_year
        } for s in sessions]
        return Response(data)