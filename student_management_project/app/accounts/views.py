from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import authenticate, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken

from .models import CustomUser, Students, Staffs, AdminHOD
from .serializers import UserSerializer, StudentSerializer, StaffSerializer, AdminHODSerializer

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

        # 1. Identify role from email (e.g., alex.student@gmail.com)
        user_type = self.get_user_type_from_email(email)
        if not user_type:
            return Response({
                "error": "Invalid format. Email must include .hod, .staff, or .student before the @ (e.g., alex.student@gmail.com)"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # 2. Extract a safe username (everything before the @)
        username = email.split('@')[0] 
        
        try:
            # 3. Create user using create_user (Hashed password)
            user = CustomUser.objects.create_user(
                username=username, 
                email=email, 
                password=password,
                first_name=first_name, 
                last_name=last_name, 
                user_type=user_type
            )
            
            # 4. Create the corresponding profile record
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
        """Helper to map name.role@domain.com to user_type"""
        try:
            # Splits 'alex.student@gmail.com' -> 'alex.student' -> 'student'
            role_part = email_id.split('@')[0].split('.')[1].lower()
            mapping = {
                'hod': '1',
                'staff': '2',
                'student': '3'
            }
            return mapping.get(role_part)
        except (IndexError, AttributeError):
            return None

# --- LOGIN ---
@method_decorator(csrf_exempt, name='dispatch')
class LoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({"error": "Please provide both email and password"}, status=status.HTTP_400_BAD_REQUEST)

        # IMPORTANT: Since USERNAME_FIELD = 'email', we must pass email=email here
        user = authenticate(request, email=email, password=password)

        if user is not None:
            if user.is_active:
                refresh = RefreshToken.for_user(user)
                return Response({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user_type": user.user_type,
                    "user": UserSerializer(user).data,
                    "message": "Login Successful"
                }, status=status.HTTP_200_OK)
            else:
                return Response({"error": "This account has been disabled"}, status=status.HTTP_403_FORBIDDEN)
            
        return Response({"error": "Invalid Credentials. Check your email and password."}, status=status.HTTP_401_UNAUTHORIZED)

# --- LOGOUT & PROFILE ---
class LogoutAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # For JWT, logout is usually handled by deleting the token on the frontend,
        # but we can blacklist the token if blacklist app is configured.
        logout(request)
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

class ProfileAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            if user.user_type == '1':
                profile = AdminHOD.objects.get(admin=user)
                return Response({
                    "my_profile": AdminHODSerializer(profile).data,
                    "dashboard_stats": {
                        "total_students": Students.objects.count(),
                        "total_staffs": Staffs.objects.count(),
                    }
                })
            elif user.user_type == '2':
                profile = Staffs.objects.get(admin=user)
                return Response(StaffSerializer(profile).data)
            elif user.user_type == '3':
                profile = Students.objects.get(admin=user)
                return Response(StudentSerializer(profile).data)
        except Exception as e:
            return Response({"error": f"Profile not found: {str(e)}"}, status=status.HTTP_404_NOT_FOUND)