from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenBlacklistView

app_name = "api"
urlpatterns = [
    path('register/', views.UserSignUpView.as_view(), name='register'),
    path('login/', views.UserLoginView.as_view(), name="login"),
    path('logout/', views.UserLogoutView.as_view(), name="logout"),
    path('profile/', views.UserProfileView.as_view(), name='profile')
]
