from django.contrib.auth.models import AbstractUser
from django.db import models
from app.core.models import BaseModel

class CustomUser(AbstractUser):
    HOD = '1'
    STAFF = '2'
    STUDENT = '3'
    
    user_type_data = ((HOD, "HOD"), (STAFF, "Staff"), (STUDENT, "Student"))
    user_type = models.CharField(default=1, choices=user_type_data, max_length=10)

    email = models.EmailField(unique=True) 
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username'] 

    EMAIL_TO_USER_TYPE_MAP = {
        'hod': HOD,
        'staff': STAFF,
        'student': STUDENT
    }
class AdminHOD(BaseModel):
    id = models.AutoField(primary_key=True)
    admin = models.OneToOneField(CustomUser, on_delete=models.CASCADE)

class Staffs(BaseModel):
    id = models.AutoField(primary_key=True)
    admin = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    address = models.TextField()

class Students(BaseModel):
    id = models.AutoField(primary_key=True)
    admin = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    gender = models.CharField(max_length=50)
    profile_pic = models.FileField(upload_to="profile_pics/")
    address = models.TextField()
    course_id = models.ForeignKey(
        'curriculum.Courses', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True
    )
    session_year_id = models.ForeignKey('core.SessionYearModel', on_delete=models.CASCADE, null=True)