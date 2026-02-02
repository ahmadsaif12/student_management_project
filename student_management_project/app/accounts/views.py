from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import login, logout, authenticate
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from .models import CustomUser, Students, Staffs, AdminHOD
from .serializers import UserSerializer, StudentSerializer, StaffSerializer, AdminHODSerializer

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
            return Response({"error": "Invalid email format for roles"}, status=status.HTTP_400_BAD_REQUEST)
        
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
            
            # Profile creation: get_or_create prevents duplicate errors
            if user_type == "1": 
                AdminHOD.objects.get_or_create(admin=user)
            elif user_type == "2": 
                Staffs.objects.get_or_create(admin=user)
            elif user_type == "3": 
                Students.objects.get_or_create(admin=user)

            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get_user_type_from_email(self, email_id):
        try:
            email_user_type = email_id.split('@')[0].split('.')[1]
            return CustomUser.EMAIL_TO_USER_TYPE_MAP.get(email_user_type)
        except: 
            return None

@method_decorator(csrf_exempt, name='dispatch')
class LoginAPIView(APIView):
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
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

class ProfileAPIView(APIView):
   
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            # --- ADMIN 
            if user.user_type == '1':
                profile = AdminHOD.objects.get(admin=user)
                
                all_students = Students.objects.all()
                all_staffs = Staffs.objects.all()
                
                return Response({
                    "my_profile": AdminHODSerializer(profile).data,
                    "dashboard_stats": {
                        "total_students": all_students.count(),
                        "total_staffs": all_staffs.count(),
                    },
                    "student_records": StudentSerializer(all_students, many=True).data,
                    "staff_records": StaffSerializer(all_staffs, many=True).data
                })

            # --- STAFF LOGIC ---
            elif user.user_type == '2':
                profile = Staffs.objects.get(admin=user)
                return Response(StaffSerializer(profile).data)

            # --- STUDENT LOGIC ---
            elif user.user_type == '3':
                profile = Students.objects.get(admin=user)
                return Response(StudentSerializer(profile).data)

        except Exception as e:
            return Response({"error": f"Profile Error: {str(e)}"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        user = request.user
        data = request.data
        
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        if data.get('password'):
            user.set_password(data.get('password'))
        user.save()

        try:
            if user.user_type == '2':
                profile = Staffs.objects.get(admin=user)
                profile.address = data.get('address', profile.address)
                profile.save()
            elif user.user_type == '3':
                profile = Students.objects.get(admin=user)
                profile.address = data.get('address', profile.address)
                profile.save()
            return Response({"message": "Profile updated successfully"})
        except:
            return Response({"error": "Profile details not found for update"}, status=status.HTTP_404_NOT_FOUND)