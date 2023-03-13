from django.shortcuts import render

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.generics import CreateAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied

from ..serializers.user import CustomUserSerializer
from ..models.user import CustomUser
from ..models.reservation import Reservation, Request
from ..models.rentalproperty import RentalProperty, PropertyImage
from ..serializers.reservation import ReservationSerializer

# four classes for reservation
# create, delete, edit, view
# each view should only be accessible by the user who created the reservation

class ViewReservationView(RetrieveAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]


class CreateReservationView(CreateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Get the rental property object from the request data
        rental_property_id = self.request.data.get('property')
        rental_property = RentalProperty.objects.get(id=rental_property_id)

        # Get the current user object
        user = self.request.user

        # Check if the rental property belongs to the current user
        if rental_property.owner != user.custom_user:
            return Response({'error': 'You are not authorized to make a reservation for this property.'}, status=status.HTTP_403_FORBIDDEN)

        # Set the user field of the reservation to the current user
        serializer.save(user=user, property=rental_property)

        return Response(serializer.data, status = status.HTTP_201_CREATED)



class EditReservationView(UpdateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Get the reservation object from the database based on the URL parameter
        reservation_id = self.kwargs['pk']
        reservation = get_object_or_404(Reservation, id=reservation_id)

        # Check if the user is the owner of the rental property associated with the reservation
        user = self.request.user
        if reservation.user != user:
            return Response({'error': 'You are not the owner of this property.'}, status = status.HTTP_403_FORBIDDEN)

        return reservation

    def put(self, request, *args, **kwargs):
        reservation = self.get_object()
            

        serializer = ReservationSerializer(instance=reservation, data=request.data, partial=True)
        # partial = True indicates that only a subset of the field will be updated

        if serializer.is_valid():
            serializer.save() # basically it is calling serializer.update() with the new info

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteReservationView(DestroyAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Reservation.objects.filter(user=self.request.user)

    def delete(self, request, *args, **kwargs):
        reservation = self.get_object()
        rental_property = reservation.property

        if rental_property.owner != request.user.custom_user:
            raise PermissionDenied("You don't have permission to delete this reservation")

        reservation.delete()

        return Response({'success': 'Reservation Deleted!'}, status = status.HTTP_204_NO_CONTENT)

class ReservationDetailView(APIView):
    serializer_class = ReservationSerializer

    def get_object(self, reservation_id):
        return get_object_or_404(Reservation, id=reservation_id)

    def get(self, request, reservation_id):
        reservation = self.get_object(reservation_id)
        serializer = self.serializer_class(reservation)
        return Response(serializer.data)

class PropertyReservationsView(APIView):
    serializer_class = ReservationSerializer

    def get_queryset(self, property_id):
        # get all reservations for a property
        # return 404 if property does not exist

        return Reservation.objects.filter(property=property_id)

    def get(self, request, property_id):
        reservations = self.get_queryset(property_id)
        serializer = self.serializer_class(reservations, many=True)
        return Response(serializer.data)

