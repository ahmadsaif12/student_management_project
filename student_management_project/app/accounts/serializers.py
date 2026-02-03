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
    admin = UserSerializer(read_only=True)
    class Meta:
        model = Students
        fields = '__all__'

class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser 
        fields = ['id', 'username', 'first_name', 'last_name', 'email'] 
        # Ensure 'address' is NOT here because CustomUser doesn't have it.
class AdminHODSerializer(serializers.ModelSerializer):
    admin = UserSerializer(read_only=True)
    class Meta:
        model = AdminHOD
        fields = '__all__'