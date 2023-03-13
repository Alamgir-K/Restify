from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenBlacklistView
from django.conf.urls.static import static
from django.conf import settings

app_name = "api"
urlpatterns = [
    path('property/create/', views.PropertyCreateView.as_view(), name='create_property'),
    path('register/', views.UserSignUpView.as_view(), name='register'),
    path('login/', views.UserLoginView.as_view(), name="login"),
    path('logout/', views.UserLogoutView.as_view(), name="logout"),
    path('profile/', views.UserProfileView.as_view(), name='profile')
] + static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)

