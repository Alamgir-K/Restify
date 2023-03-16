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
from ..serializers.reservation import ReservationSerializer


class CreateReservationView(CreateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Get the rental property object from the request data
        rental_property_id = self.request.data.get('property')
        rental_property = RentalProperty.objects.get(id=rental_property_id)

        # filter for all reservations that have this property, and their start/end dates overlap
        # if one of those reservations status is Approved, return an error

        other_reservations = Reservation.objects.filter(
            property=rental_property)
        for reservation in other_reservations:
            if reservation.status == "Approved":
                if self.request.data.get('start_date') <= reservation.end_date and self.request.data.get('end_date') >= reservation.start_date:
                    return Response({'error': 'This property is not available during this time'}, status=status.HTTP_403_FORBIDDEN)

        user = get_object_or_404(CustomUser, user=self.request.user)
        serializer.save(user=user, property=rental_property, status="Pending")

        # reservation = Reservation.objects.get(id=serializer.data.get('id'))
        reservation = serializer.instance

        notification = Notification.objects.create(
            user=rental_property.owner,
            reservation=reservation,
            message=f"{user.user.username} has requested a new reservation for {rental_property.name}"
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class EditReservationView(UpdateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        reservation_id = self.kwargs.get('pk')
        reservation = get_object_or_404(Reservation, id=reservation_id)
        return reservation

    def put(self, request, *args, **kwargs):
        reservation = self.get_object()
        user = get_object_or_404(CustomUser, user=self.request.user)

        new_status = self.request.data.get('status')
        # if reservation.user == user:
        #     if new_status == "Cancelled":
        #         serializer = ReservationSerializer(instance=reservation, data=request.data, partial=True)

        #         if serializer.is_valid():
        #             serializer.save()

        #             notification = Notification.objects.create(
        #             user=reservation.property.owner,
        #             reservation=reservation,
        #             message=f"{user.user.username} has cancelled their reservation for {reservation.property.name}"
        #         )

        #             return Response(serializer.data, status=status.HTTP_200_OK)
        #         return Response({'error': 'You cannot update this reservation to this'}, status=status.HTTP_403_FORBIDDEN)

        if reservation.property.owner == user:
            print("owner found")
            if reservation.status == "Pending" and new_status in ["Denied", "Approved", "Terminated"]:
                print("in properly")
                serializer = ReservationSerializer(instance=reservation, data=request.data, partial=True)

                if serializer.is_valid():
                    print("serializer passed")
                    serializer.save()
                #     notification = Notification.objects.create(
                #     user=reservation.user,
                #     reservation=reservation,
                #     message=f"{reservation.property.owner.user.username} has {reservation.status} your reservation for {reservation.property.name}"
                # )

                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({'error': 'You cannot update this reservation to this'}, status=status.HTTP_403_FORBIDDEN)

            elif reservation.status == "Approved" and new_status in ["Completed", "Terminated"]:
                serializer = ReservationSerializer(instance=reservation, data=request.data, partial=True)

                if serializer.is_valid():
                    serializer.save()
                #     notification = Notification.objects.create(
                #     user=reservation.user,
                #     reservation=reservation,
                #     message=f"{reservation.property.owner.user.username} has {reservation.status} your reservation for {reservation.property.name}"
                # )

                    return Response(serializer.data, status=status.HTTP_200_OK)   
                return Response({'error': 'You cannot update this reservation to this'}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({'error': 'You cannot update this reservation'}, status=status.HTTP_403_FORBIDDEN)


class DeleteReservationView(DestroyAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        reservation_id = self.kwargs['pk']
        reservation = get_object_or_404(Reservation, id=reservation_id)

        if reservation.user.custom_user != self.request.user.custom_user:
            return Response({'error': 'You cannot delete this reservation'}, status=status.HTTP_403_FORBIDDEN)

        reservation.delete()

        return Response({'success': 'Reservation Deleted!'}, status=status.HTTP_204_NO_CONTENT)


class HostReservationsView(ListAPIView):
    serializer_class = ReservationSerializer
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
    serializer_class = ReservationSerializer
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
