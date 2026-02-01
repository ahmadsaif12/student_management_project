from django.db import models
from app.core.models import BaseModel

class Attendance(BaseModel):
    id = models.AutoField(primary_key=True)
    subject_id = models.ForeignKey('curriculum.Subjects', on_delete=models.DO_NOTHING)
    attendance_date = models.DateField()
    session_year_id = models.ForeignKey('core.SessionYearModel', on_delete=models.CASCADE)

class AttendanceReport(BaseModel):
    id = models.AutoField(primary_key=True)
    student_id = models.ForeignKey('accounts.Students', on_delete=models.DO_NOTHING)
    attendance_id = models.ForeignKey(Attendance, on_delete=models.CASCADE)
    status = models.BooleanField(default=False)