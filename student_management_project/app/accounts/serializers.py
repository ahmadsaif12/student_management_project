from rest_framework import serializers
from .models import CustomUser, Students, Staffs, AdminHOD

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'user_type', 'password')

    def create(self, validated_data):
        
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            user_type=validated_data.get('user_type', '1') 
        )
        return user
    

class StudentSerializer(serializers.ModelSerializer):
    # These are for DISPLAY (GET requests)
    email = serializers.EmailField(source='admin.email', read_only=True)
    course_name = serializers.CharField(source='course_id.course_name', read_only=True)
    
    # These are for DATA ENTRY (POST requests)
    # We MUST define first_name and last_name as writable here
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    raw_email = serializers.EmailField(write_only=True)

    class Meta:
        model = Students
        fields = [
            'id', 'first_name', 'last_name', 'email', 'raw_email', 'password',
            'gender', 'address', 'profile_pic', 'course_id', 'course_name', 'session_year_id'
        ]

    def create(self, validated_data):
        # Extract the user data from the validated dictionary
        password = validated_data.pop('password')
        email = validated_data.pop('raw_email')
        f_name = validated_data.pop('first_name')
        l_name = validated_data.pop('last_name')

        # Create the base User
        user = CustomUser.objects.create_user(
            username=email.split('@')[0],
            email=email,
            password=password,
            first_name=f_name, 
            last_name=l_name,
            user_type="3"  # Fixed for Student
        )
        
        student = Students.objects.create(admin=user, **validated_data)
        return student
    

class AdminHODSerializer(serializers.ModelSerializer):
    admin = UserSerializer(read_only=True)
    class Meta:
        model = AdminHOD
        fields = '__all__'

class StaffSerializer(serializers.ModelSerializer):
    # WRITE-ONLY: Used when creating a new staff member
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    raw_email = serializers.EmailField(write_only=True)
    gender = serializers.CharField(write_only=True)

    # READ-ONLY: Used when listing staff in the directory
    email = serializers.EmailField(source='admin.email', read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Staffs
        # Both write and read fields must be listed here
        fields = [
            'id', 'email', 'full_name', 'address', 
            'first_name', 'last_name', 'raw_email', 'password', 'gender'
        ]

    def get_full_name(self, obj):
        if obj.admin:
            return f"{obj.admin.first_name} {obj.admin.last_name}"
        return "No Identity Linked"

    def create(self, validated_data):
        # Extract data for the User model
        p_word = validated_data.pop('password')
        email = validated_data.pop('raw_email')
        f_name = validated_data.pop('first_name')
        l_name = validated_data.pop('last_name')
        gender_val = validated_data.pop('gender')

        # 1. Create User
        user = CustomUser.objects.create_user(
            username=email.split('@')[0],
            email=email,
            password=p_word,
            first_name=f_name,
            last_name=l_name,
            user_type="2"
        )
        
        # 2. Assign gender to user if model supports it
        if hasattr(user, 'gender'):
            user.gender = gender_val
            user.save()

        # 3. Create Staff Profile
        return Staffs.objects.create(admin=user, **validated_data)