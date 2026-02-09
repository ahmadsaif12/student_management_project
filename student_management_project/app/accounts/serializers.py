from rest_framework import serializers
from .models import CustomUser, Students, Staffs, AdminHOD

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'user_type', 'password','last_login')

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
    # This nested object provides 'username', 'last_login', and 'id'
    admin = UserSerializer(read_only=True) 
    
    # Map these specifically for the GET request (Profile View)
    # We use a different name for the 'source' to pull from the User model
    first_name = serializers.CharField(source='admin.first_name', read_only=True)
    last_name = serializers.CharField(source='admin.last_name', read_only=True)
    email = serializers.EmailField(source='admin.email', read_only=True)
    course_name = serializers.CharField(source='course_id.course_name', read_only=True)

    # These are only used when you POST (Registering a student)
    # They will NOT interfere with the display fields above
    f_name = serializers.CharField(write_only=True)
    l_name = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    raw_email = serializers.EmailField(write_only=True)

    class Meta:
        model = Students
        fields = [
            'id', 'admin', 'first_name', 'last_name', 'email', 
            'f_name', 'l_name', 'raw_email', 'password',
            'gender', 'address', 'profile_pic', 'course_id', 'course_name', 'session_year_id'
        ]

    def create(self, validated_data):
        # Use the internal f_name/l_name for creation
        p_word = validated_data.pop('password')
        mail = validated_data.pop('raw_email')
        fname = validated_data.pop('f_name')
        lname = validated_data.pop('l_name')
        
        user = CustomUser.objects.create_user(
            username=mail.split('@')[0],
            email=mail,
            password=p_word,
            first_name=fname, 
            last_name=lname,
            user_type="3"
        )
        return Students.objects.create(admin=user, **validated_data)
    
class AdminHODSerializer(serializers.ModelSerializer):
    admin = UserSerializer(read_only=True)
    class Meta:
        model = AdminHOD
        fields = '__all__'

class StaffSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    raw_email = serializers.EmailField(write_only=True)
    gender = serializers.CharField(write_only=True)
    email = serializers.EmailField(source='admin.email', read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Staffs
        fields = [
            'id', 'email', 'full_name', 'address', 
            'first_name', 'last_name', 'raw_email', 'password', 'gender'
        ]

    def get_full_name(self, obj):
        if obj.admin:
            return f"{obj.admin.first_name} {obj.admin.last_name}"
        return "No Identity Linked"

    def create(self, validated_data):
        p_word = validated_data.pop('password')
        email = validated_data.pop('raw_email')
        f_name = validated_data.pop('first_name')
        l_name = validated_data.pop('last_name')
        gender_val = validated_data.pop('gender')

        user = CustomUser.objects.create_user(
            username=email.split('@')[0],
            email=email,
            password=p_word,
            first_name=f_name,
            last_name=l_name,
            user_type="2"
        )
        
        if hasattr(user, 'gender'):
            user.gender = gender_val
            user.save()
        return Staffs.objects.create(admin=user, **validated_data)