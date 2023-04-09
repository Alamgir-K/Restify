from django.shortcuts import render

from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView, UpdateAPIView, DestroyAPIView, ListAPIView
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination

from ..models.notification import Notification
from ..serializers.user import CustomUserSerializer
from ..models.user import CustomUser
from ..models.reservation import Reservation
from ..models.rentalproperty import RentalProperty
from ..serializers.reservation import ReservationCreateSerializer, ReservationUpdateSerializer
from django.core import serializers


class CreateReservationView(CreateAPIView):
    serializer_class = ReservationCreateSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)  
        # Get the rental property object from the request data
        rental_property_id = self.request.data.get('property')
        rental_property = RentalProperty.objects.get(id=rental_property_id)

        # check whether reservation by this user for this property already exists
        exists = Reservation.objects.filter(
            property=rental_property, user=self.request.user.custom_user)
        if exists:
            print("no duplicate")
            return Response({'error': 'You have already made a reservation for this property'}, status=status.HTTP_403_FORBIDDEN)

        other_reservations = Reservation.objects.filter(
            property=rental_property)
        for reservation in other_reservations:
            if reservation.status == "Approved":
                if self.request.data.get('start_date') <= reservation.end_date and self.request.data.get('end_date') >= reservation.start_date:
                    return Response({'error': 'This property is not available during this time'}, status=status.HTTP_403_FORBIDDEN)

        user = get_object_or_404(CustomUser, user=self.request.user)
        serializer.save(user=user, property=rental_property, status="Pending")

        reservation = serializer.instance

        notification = Notification.objects.create(
            user=rental_property.owner,
            reservation=reservation,
            message=f"{user.user.username} has requested a new reservation for {rental_property.name}"
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class EditReservationView(UpdateAPIView):
    serializer_class = ReservationUpdateSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        reservation_id = self.kwargs['pk']
        reservation = get_object_or_404(Reservation, id=reservation_id)
        user = get_object_or_404(CustomUser, user=self.request.user)

        new_status = self.request.data.get('status')
        if reservation.user == user:
            if new_status == "Cancelled":
                
                reservation.status = new_status
                reservation.save()
                serializer = ReservationUpdateSerializer(reservation)

                notification = Notification.objects.create(
                    user=reservation.user,
                    reservation=reservation,
                    message=f"{reservation.property.owner.user.username} has {reservation.status} your reservation for {reservation.property.name}"
                )

                return Response(serializer.data)

            else:
                return Response({'error': 'You cannot update this reservation to this'}, status=status.HTTP_403_FORBIDDEN)
        if reservation.property.owner == user:
            if reservation.status == "Pending" and new_status in ["Denied", "Approved", "Terminated"]:
                reservation.status = new_status
                reservation.save()
                serializer = ReservationUpdateSerializer(reservation)

                notification = Notification.objects.create(
                    user=reservation.user,
                    reservation=reservation,
                    message=f"{reservation.property.owner.user.username} has {reservation.status} your reservation for {reservation.property.name}"
                )

                return Response(serializer.data)


            elif reservation.status == "Approved" and new_status in ["Completed", "Terminated"]:
                reservation.status = new_status
                reservation.save()
                serializer = ReservationUpdateSerializer(reservation)

                notification = Notification.objects.create(
                    user=reservation.user,
                    reservation=reservation,
                    message=f"{reservation.property.owner.user.username} has {reservation.status} your reservation for {reservation.property.name}"
                )

                return Response(serializer.data)


            else:
                return Response({'error': 'You cannot update this reservation to this'}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({'error': 'You cannot update this reservation'}, status=status.HTTP_403_FORBIDDEN)


class DeleteReservationView(DestroyAPIView):
    serializer_class = ReservationCreateSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        reservation_id = self.kwargs['pk']
        reservation = get_object_or_404(Reservation, id=reservation_id)

        if reservation.user != self.request.user.custom_user:
            return Response({'error': 'You cannot delete this reservation'}, status=status.HTTP_403_FORBIDDEN)

        reservation.delete()

        return Response({'success': 'Reservation Deleted!'}, status=status.HTTP_204_NO_CONTENT)


class HostReservationsView(ListAPIView):
    serializer_class = ReservationCreateSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        query_set = Reservation.objects.filter(
            property__owner=self.request.user.custom_user)

        # filter by property
        property_id = self.request.query_params.get('property', None)
        if property_id is not None:
            query_set = query_set.filter(property=property_id)

        # filter by status
        status = self.request.query_params.get('status', None)
        if status is not None:
            query_set = query_set.filter(status=status)

        return query_set


class UserReservationsView(ListAPIView):
    serializer_class = ReservationCreateSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        user = self.request.user.custom_user
        query_set = Reservation.objects.filter(user=user)

        property_id = self.request.query_params.get('property', None)
        # filter by property
        if property_id is not None:
            query_set = query_set.filter(reservation__property=property_id)

        # filter by status
        status = self.request.query_params.get('status', None)
        if status is not None:
            query_set = query_set.filter(status=status)

        return query_set
