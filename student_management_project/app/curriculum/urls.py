from django.urls import path
from .views import StaffSubjectList, AllCurriculumData

urlpatterns = [
    # Used by Staff to see their assigned subjects
    path('staff-subjects/', StaffSubjectList.as_view(), name='api_staff_subjects'),
    
    # Used by HOD to get data for dropdowns/forms
    path('all-data/', AllCurriculumData.as_view(), name='api_curriculum_data'),
]