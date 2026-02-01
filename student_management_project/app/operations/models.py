from django.db import models
from app.core.models import BaseModel

class StudentResult(BaseModel):
    id = models.AutoField(primary_key=True)
    student_id = models.ForeignKey('accounts.Students', on_delete=models.CASCADE)
    subject_id = models.ForeignKey('curriculum.Subjects', on_delete=models.CASCADE)
    subject_exam_marks = models.FloatField(default=0)
    subject_assignment_marks = models.FloatField(default=0)

class LeaveReportStudent(BaseModel):
    student_id = models.ForeignKey('accounts.Students', on_delete=models.CASCADE)
    leave_date = models.CharField(max_length=255)
    leave_message = models.TextField()
    leave_status = models.IntegerField(default=0)

class LeaveReportStaff(BaseModel):
    staff_id = models.ForeignKey('accounts.Staffs', on_delete=models.CASCADE)
    leave_date = models.CharField(max_length=255)
    leave_message = models.TextField()
    leave_status = models.IntegerField(default=0)

class FeedBackStudent(BaseModel):
    student_id = models.ForeignKey('accounts.Students', on_delete=models.CASCADE)
    feedback = models.TextField()
    feedback_reply = models.TextField()

class FeedBackStaffs(BaseModel):
    staff_id = models.ForeignKey('accounts.Staffs', on_delete=models.CASCADE)
    feedback = models.TextField()
    feedback_reply = models.TextField()

class NotificationStudent(BaseModel):
    student_id = models.ForeignKey('accounts.Students', on_delete=models.CASCADE)
    message = models.TextField()

class NotificationStaffs(BaseModel):
    stafff_id = models.ForeignKey('accounts.Staffs', on_delete=models.CASCADE)
    message = models.TextField()