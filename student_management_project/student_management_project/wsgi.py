import os
import sys
from django.core.wsgi import get_wsgi_application

# Add the project directory to the sys.path so Vercel can find the modules
path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if path not in sys.path:
    sys.path.append(path)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'student_management_project.settings')

application = get_wsgi_application()

# CRITICAL: Vercel looks for 'app', not 'application'
app = application