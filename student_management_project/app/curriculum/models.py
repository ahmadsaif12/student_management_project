from django.db import models
from app.core.models import BaseModel

class Courses(BaseModel):
    id = models.AutoField(primary_key=True)
    course_name = models.CharField(max_length=255)

class Subjects(BaseModel):
    id = models.AutoField(primary_key=True)
    subject_name = models.CharField(max_length=255)
    course_id = models.ForeignKey(Courses, on_delete=models.CASCADE, default=1)
    staff_id = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE)