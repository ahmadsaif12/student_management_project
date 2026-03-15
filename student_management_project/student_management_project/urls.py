"""
URL configuration for student_management_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
# this is extra
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        "message": "Student Management API is live",
        "endpoints": {
            "accounts": "/api/accounts/",
            "curriculum": "/api/curriculum/",
            "admin": "/admin/"
        }
    })
urlpatterns = [
    path('', api_root), #extra for deployment
    path('admin/', admin.site.urls),
    path('api/accounts/', include('app.accounts.urls')),
    path('api/curriculum/', include('app.curriculum.urls')),
    path('api/attendance/', include('app.attendance.urls')),
    path('api/operations/', include('app.operations.urls')),
    path('api/core/', include('app.core.urls')),
]
