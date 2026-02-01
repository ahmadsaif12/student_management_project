from django.urls import path
from .views import (
    StaffCurriculumStats, 
    StaffSubjectList, 
    AllCurriculumData
)

urlpatterns = [
    
    path('staff-stats/', StaffCurriculumStats.as_view(), name='api_staff_curriculum_stats'),
    path('staff-subjects/', StaffSubjectList.as_view(), name='api_staff_subjects'),
    path('all-data/', AllCurriculumData.as_view(), name='api_curriculum_data'),
]