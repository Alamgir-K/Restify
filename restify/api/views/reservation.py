from django.shortcuts import render

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.generics import CreateAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView, ListAPIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied
from rest_framework.pagination import PageNumberPagination

from ..serializers.user import CustomUserSerializer
from ..models.user import CustomUser
from ..models.reservation import Reservation, Request
from ..models.rentalproperty import RentalProperty, PropertyImage
from ..serializers.reservation import ReservationSerializer, RequestSerializer

# four classes for reservation
# create, delete, edit, view
# each view should only be accessible by the user who created the reservation


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


class CreateRequestView(CreateAPIView):
    serializer_class = RequestSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Get the rental property object from the request data
        reservation_id = self.request.data.get('reservation')
        reservation = Reservation.objects.get(id=reservation_id)

        # Get the current user object
        user = self.request.user

        if reservation.status in ['Approved', 'Expired', 'Completed']:
            return Response({'error': 'You are not authorized to make a request for this reservation.'}, status=status.HTTP_403_FORBIDDEN)
        else:
            reservation.status = 'Pending'
            reservation.save()

        # Set the user field of the reservation to the current user
        serializer.save(user=user, reservation=reservation)

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

    def get_object(self):
        reservation_id = self.kwargs['pk']
        return get_object_or_404(Reservation, id=reservation_id)

    def get(self, request, pk):
        reservation = self.get_object()
        serializer = self.serializer_class(reservation)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AllHostReservationsView(ListAPIView):
    serializer_class = ReservationSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        query_set = Reservation.objects.filter(property__owner=self.request.user.custom_user)

        #filter by property
        property_id = self.request.query_params.get('property', None)
        if property_id is not None:
            query_set = query_set.filter(property=property_id)

        #filter by status
        status = self.request.query_params.get('status', None)
        if status is not None:
            query_set = query_set.filter(status=status)

        return query_set


class AllHostRequestsView(ListAPIView):
    serializer_class = RequestSerializer
    pagination_class = PageNumberPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        query_set = Request.objects.filter(reservation__user=user)

        #filter by property
        property_id = self.request.query_params.get('property', None)
        if property_id is not None:
            query_set = query_set.filter(reservation__property=property_id)

        return query_set


class PropertyReservationsView(ListAPIView):
    serializer_class = ReservationSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):

        return Reservation.objects.filter(property=self.kwargs["pk"])

class UserRequestsView(ListAPIView):
    serializer_class = RequestSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        user = self.request.user
        query_set = Request.objects.filter(user=user)

        property_id = self.request.query_params.get('property', None)
        # filter by property
        if property_id is not None:
            query_set = query_set.filter(reservation__property=property_id)

        #filter by status
        status = self.request.query_params.get('status', None)
        if status is not None:
            query_set = query_set.filter(status=status)

        

        return query_set

    # def get(self, request, pk):
    #     # paginator = PageNumberPagination
    #     requests = self.get_queryset()
    #     # # serializer = self.serializer_class(requests, many=True)
    #     # return Response(serializer.data, status=status.HTTP_200_OK)


class ReservationRequestsView(ListAPIView):
    serializer_class = RequestSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        query_set = Request.objects.filter(reservation=self.kwargs['pk'])
        return query_set

class RequestNextView(UpdateAPIView):
    serializer_class = RequestSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Get the request object from the database based on the URL parameter
        request_id = self.kwargs['pk']
        request = get_object_or_404(Request, id=request_id)

        # Check if the user is the owner of the rental property associated with the reservation
        user = self.request.user
        if request.user != user:
            return Response({'error': 'You are not the owner of this request.'}, status = status.HTTP_403_FORBIDDEN)

        return request

    def put(self, request, *args, **kwargs):
        self.get_object()
        request_id = self.kwargs['pk']
        req = get_object_or_404(Request, id=request_id)
        new_state = request.data.get('status')

        if new_state == 'Cancelled':
            if req.status == 'Accepted':
                reservation = req.reservation
                reservation.status = "Pending"
                reservation.save()
            req.status = "Cancelled"
            req.save()
            
        else:
            return Response({'error': 'You cannot change the status to this.'}, status = status.HTTP_403_FORBIDDEN)

        return Response({'success': 'Request Updated!'}, status=status.HTTP_200_OK)

class ReservationNextView(UpdateAPIView):
    serializer_class = RequestSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Get the request object from the database based on the URL parameter
        request_id = self.kwargs['pk']
        request = get_object_or_404(Request, id=request_id)
        reservation = request.reservation

        # Check if the user is the owner of the rental property associated with the reservation
        user = self.request.user
        if reservation.property.owner != user:
            return Response({'error': 'You are not the owner of this reservation.'}, status = status.HTTP_403_FORBIDDEN)

        return request

    def get_other_requests(self, reservation):
        return Request.objects.filter(reservation=reservation).exclude(status="Accepted")

    def put(self, request, *args, **kwargs):
        self.get_object()
        request_id = self.kwargs['pk']
        req = get_object_or_404(Request, id=request_id)
        res = req.reservation
        new_state = request.data.get('status')

        if new_state == 'Accepted':
            res.status = "Approved"
            req.status = "Accepted"
            res.save()
            req.save()
            other_requests = self.get_other_requests(res)
            for r in other_requests:
                r.status = "Rejected"
                r.save()
        elif new_state == 'Rejected':
            req.status = "Rejected"
            res.status = "Pending"
            res.save()
            req.save()
        else:
            return Response({'error': 'You cannot change the status to this.'}, status = status.HTTP_403_FORBIDDEN)

        return Response({'success': 'Reservation Updated!'}, status=status.HTTP_200_OK)

