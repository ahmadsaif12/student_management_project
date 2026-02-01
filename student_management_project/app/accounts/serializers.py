from rest_framework import serializers
from .models import CustomUser, Students, Staffs, AdminHOD

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'user_type')

class StudentSerializer(serializers.ModelSerializer):
    admin = UserSerializer(read_only=True)
    class Meta:
        model = Students
        fields = '__all__'

class StaffSerializer(serializers.ModelSerializer):
    admin = UserSerializer(read_only=True)
    class Meta:
        model = Staffs
        fields = '__all__'

class AdminHODSerializer(serializers.ModelSerializer):
    admin = UserSerializer(read_only=True)
    class Meta:
        model = AdminHOD
        fields = '__all__'