from django.urls import path
from . import views

app_name = "api"
urlpatterns = [
    path('register/', views.UserSignUpView.as_view(), name='register'),
    path('login/', views.UserLoginView.as_view(), name="login"),
    path('logout/', views.UserLogoutView.as_view(), name="logout"),
    path('profile/view/', views.UserProfileView.as_view(), name='profile_view'),
    path('profile/edit/', views.UserEditProfileView.as_view(), name='profile_edit')
]
