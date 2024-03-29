from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenBlacklistView
from django.conf.urls.static import static
from django.conf import settings

app_name = "api"
urlpatterns = [

    path('property/search/', views.PropertySearchView.as_view(),
         name='property_search'),

    path('reservation/<int:pk>/edit/',
         views.EditReservationView.as_view(), name='edit_reservation'),
    path('reservation/<int:pk>/delete/',
         views.DeleteReservationView.as_view(), name='delete_property'),
    path('reservation/create/', views.CreateReservationView.as_view(),
         name='create_property'),
    path('reservation/user/all/',
         views.UserReservationsView.as_view(), name='all_requests'),
    path('reservation/host/all/',
         views.HostReservationsView.as_view(), name='all_requests'),

    path('comment/create/', views.CreateCommentView.as_view(), name='create_comment'),
    path('comment/<int:pk>/update/',
         views.UpdateCommentView.as_view(), name='update_comment'),
    path('comment/<int:pk>/view/',
         views.ViewPropertyCommentChain.as_view(), name='view_comment'),
    path('rating/<int:pk>/create/',
         views.CreateUserRating.as_view(), name='create_rating'),
    path('rating/<int:pk>/view/',
         views.ViewUserRatings.as_view(), name='view_rating'),

    path('property/<int:pk>/view/',
         views.PropertyDetailView.as_view(), name='view_property'),
    path('property/<int:pk>/edit/',
         views.PropertyEditView.as_view(), name='edit_property'),
    path('property/<int:pk>/delete/',
         views.PropertyDeleteView.as_view(), name='delete_property'),
    path('property/create/', views.PropertyCreateView.as_view(),
         name='create_property'),

    path('register/', views.UserSignUpView.as_view(), name='register'),
    path('login/', views.UserLoginView.as_view(), name="login"),
    path('logout/', views.UserLogoutView.as_view(), name="logout"),
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('profile/<int:id>/', views.UserPublicProfileView.as_view(),
         name='public_profile'),

    path('notifications/', views.NotificationsView.as_view(), name='notifications'),
    path('notifications/<int:notification_id>/read/',
         views.MarkNotificationReadView.as_view(), name='mark_notification_read'),
    path('notifications/<int:notification_id>/clear/',
         views.MarkNotificationClearedView.as_view(), name='mark_notification_cleared'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
