import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-mq!xdxowx1h#kl^xh6t%nm4*@g3jc4o2@rmok_i=_1p60_l7$-'
DEBUG = True
ALLOWED_HOSTS = []

# --- APP CONFIGURATION ---
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'corsheaders',
]

LOCAL_APPS = [
    'app.core',
    'app.accounts',
    'app.curriculum',
    'app.attendance',
    'app.operations',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# Identity
AUTH_USER_MODEL = 'accounts.CustomUser'

# --- MIDDLEWARE ---
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # Priority #1
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'student_management_project.urls'

# --- TEMPLATES (Kept for Admin panel, React uses APIs) ---
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# --- DATABASE ---
# --- DATABASE (PostgreSQL) ---
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB', 'student_db'),
        'USER': os.getenv('POSTGRES_USER', 'student_user'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD', 'student_pass'),
        'HOST': os.getenv('DB_HOST', 'db'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}
# --- CORS & DRF CONFIG ---
CORS_ALLOW_ALL_ORIGINS = True 
CORS_ALLOW_CREDENTIALS = True

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.BasicAuthentication',  
        'rest_framework.authentication.SessionAuthentication', 
    ],
}

# --- EMAIL SETTINGS (Terminal Output for now) ---
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# --- STATIC & MEDIA ---
STATIC_URL = 'static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'