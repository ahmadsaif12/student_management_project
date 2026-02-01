from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import login, logout, authenticate
from .models import CustomUser, Students, Staffs, AdminHOD
from .serializers import UserSerializer, StudentSerializer, StaffSerializer, AdminHODSerializer

class RegistrationAPIView(APIView):
    """Logic from doRegistration: Extracts type from email and creates User + Profile"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        email = data.get('email')
        
        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

        # Helper to find user_type (HOD=1, Staff=2, Student=3)
        user_type = self.get_user_type_from_email(email)
        if not user_type:
            return Response({"error": "Invalid email format for roles"}, status=status.HTTP_400_BAD_REQUEST)

        username = email.split('@')[0].split('.')[0]
        
        try:
            user = CustomUser.objects.create_user(
                username=username, email=email, password=data.get('password'),
                first_name=data.get('first_name'), last_name=data.get('last_name'), user_type=user_type
            )
            
            # Creating linked profile objects
            if user_type == "1": AdminHOD.objects.create(admin=user)
            elif user_type == "2": Staffs.objects.create(admin=user)
            elif user_type == "3": Students.objects.create(admin=user)

            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get_user_type_from_email(self, email_id):
        try:
            email_user_type = email_id.split('@')[0].split('.')[1]
            return CustomUser.EMAIL_TO_USER_TYPE_MAP.get(email_user_type)
        except: return None

class LoginAPIView(APIView):
    """Logic from doLogin: Authenticates and returns user details for React state"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, username=email, password=password)

        if user:
            login(request, user)
            return Response({
                "user": UserSerializer(user).data,
                "user_type": user.user_type,
                "message": "Login Successful"
            }, status=status.HTTP_200_OK)
        return Response({"error": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutAPIView(APIView):
    """Logic from logout_user"""
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

class ProfileAPIView(APIView):
    """Combined Profile Logic for HOD, Staff, and Student"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.user_type == '1': # HOD
            profile = AdminHOD.objects.get(admin=user)
            return Response(AdminHODSerializer(profile).data)
        elif user.user_type == '2': # Staff
            profile = Staffs.objects.get(admin=user)
            return Response(StaffSerializer(profile).data)
        elif user.user_type == '3': # Student
            profile = Students.objects.get(admin=user)
            return Response(StudentSerializer(profile).data)
        return Response({"error": "User type not recognized"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        user = request.user
        data = request.data
        
        # Update Common User Fields
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        if data.get('password'):
            user.set_password(data.get('password'))
        user.save()

        # Update Profile-Specific Fields (Address)
        if user.user_type == '2':
            profile = Staffs.objects.get(admin=user)
            profile.address = data.get('address', profile.address)
            profile.save()
        elif user.user_type == '3':
            profile = Students.objects.get(admin=user)
            profile.address = data.get('address', profile.address)
            profile.save()
            
        return Response({"message": "Profile updated successfully"})