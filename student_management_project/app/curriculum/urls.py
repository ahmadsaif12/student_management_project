from django.urls import path
from .views import (
    CourseListCreateView, CourseDetailView,
    SubjectListCreateView, SubjectDetailView,
    SessionListCreateView,SessionDetailView
)

urlpatterns = [
    # Paths for 'Manage Course' & 'Add Course'
    path('courses/', CourseListCreateView.as_view(), name='course-list-create'),
    path('courses/<int:pk>/', CourseDetailView.as_view(), name='course-detail'),

    # Paths for 'Manage Subject' & 'Add Subject'
    path('subjects/', SubjectListCreateView.as_view(), name='subject-list-create'),
    path('subjects/<int:pk>/', SubjectDetailView.as_view(), name='subject-detail'),

    # Paths for 'Manage Session' & 'Add Session'
    path('sessions/', SessionListCreateView.as_view(), name='session-list-create'),
    path('sessions/<int:pk>/', SessionDetailView.as_view(), name='session-detail'),
]
