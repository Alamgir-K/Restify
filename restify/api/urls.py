from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenBlacklistView
from django.conf.urls.static import static
from django.conf import settings

app_name = "api"
urlpatterns = [

    path('property/search/', views.PropertySearchView.as_view(), name='property_search'),

    path('reservation/<int:pk>/edit/', views.EditReservationView.as_view(), name='edit_reservation'),
    path('reservation/<int:pk>/delete/', views.DeleteReservationView.as_view(), name='delete_property'),
    path('reservation/create/', views.CreateReservationView.as_view(), name='create_property'),
    path('reservation/<int:pk>/view/', views.ReservationDetailView.as_view(), name='view_property'),
    path('property/<int:pk>/reservation/view/', views.PropertyReservationsView.as_view(), name='view_properties'),
    path('reservation/<int:pk>/next/', views.ReservationNextView.as_view(), name='reservation_next'),
    path('reservation/all/', views.AllHostReservationsView.as_view(), name='all_reservations'),

    path('reservation/<int:pk>/request/view/', views.ReservationRequestsView.as_view(), name='reservation_requests'),
    path('user/request/view/', views.UserRequestsView.as_view(), name='user_requests'),
    path('request/<int:pk>/next/', views.RequestNextView.as_view(), name='request_next'),
    path('request/create/', views.CreateRequestView.as_view(), name='create_request'),
    path('request/all/', views.AllHostRequestsView.as_view(), name='all_requests'),

    path('comment/create/', views.CreateCommentView.as_view(), name='create_comment'),
    path('comment/<int:pk>/update/', views.UpdateCommentView.as_view(), name='update_comment'),
    path('comment/<int:pk>/view/', views.ViewPropertyCommentChain.as_view(), name='view_comment'),
    path('rating/<int:pk>/create/', views.CreateUserRating.as_view(), name='create_rating'),
    path('rating/<int:pk>/view/', views.ViewUserRatings.as_view(), name='view_rating'),

    path('property/<int:pk>/edit/', views.PropertyEditView.as_view(), name='edit_property'),
    path('property/<int:pk>/delete/', views.PropertyDeleteView.as_view(), name='delete_property'),
    path('property/create/', views.PropertyCreateView.as_view(), name='create_property'),

    path('register/', views.UserSignUpView.as_view(), name='register'),
    path('login/', views.UserLoginView.as_view(), name="login"),
    path('logout/', views.UserLogoutView.as_view(), name="logout"),
    path('profile/', views.UserProfileView.as_view(), name='profile')
] + static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)

