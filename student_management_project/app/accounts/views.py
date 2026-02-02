from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import authenticate, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken # New Import

from .models import CustomUser, Students, Staffs, AdminHOD
from .serializers import UserSerializer, StudentSerializer, StaffSerializer, AdminHODSerializer

# --- REGISTRATION ---
@method_decorator(csrf_exempt, name='dispatch')
class RegistrationAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        email = data.get('email')
        
        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

        user_type = self.get_user_type_from_email(email)
        if not user_type:
            return Response({"error": "Invalid email format (e.g., name.staff@school.com)"}, status=status.HTTP_400_BAD_REQUEST)
        
        username = email.split('@')[0].split('.')[0]
        
        try:
            user = CustomUser.objects.create_user(
                username=username, 
                email=email, 
                password=data.get('password'),
                first_name=data.get('first_name'), 
                last_name=data.get('last_name'), 
                user_type=user_type
            )
            
            if user_type == "1": AdminHOD.objects.get_or_create(admin=user)
            elif user_type == "2": Staffs.objects.get_or_create(admin=user)
            elif user_type == "3": Students.objects.get_or_create(admin=user)

            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get_user_type_from_email(self, email_id):
        try:
            role_part = email_id.split('@')[0].split('.')[1]
            return CustomUser.EMAIL_TO_USER_TYPE_MAP.get(role_part)
        except: return None

# --- UPDATED LOGIN (JWT) ---
@method_decorator(csrf_exempt, name='dispatch')
class LoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        # In CustomUser, authenticate usually takes username, but if you 
        # customized it to take email, this will work.
        user = authenticate(request, username=email, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user_type": user.user_type,
                "user": UserSerializer(user).data,
                "message": "Login Successful"
            }, status=status.HTTP_200_OK)
            
        return Response({"error": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# --- LOGOUT & PROFILE ---
class LogoutAPIView(APIView):
    def post(self, request):
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
            return Response({"error": str(e)}, status=404)