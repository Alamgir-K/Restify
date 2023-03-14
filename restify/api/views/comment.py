from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.generics import CreateAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView, ListAPIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination

from ..models.user import CustomUser
from ..models.rentalproperty import RentalProperty
from ..models.reservation import Reservation, Request
from ..models.comments import UserRating, CommentChain
from ..serializers.comment import UserRatingSerializer, CommentChainSerializer


class CreateCommentView(CreateAPIView):
    serializer_class = CommentChainSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Get the rental property object from the request data
        reservation_id = self.request.data.get('reservation')
        new_comment = self.request.data.get('comment')
        reservation = get_object_or_404(Reservation, id=reservation_id)
        if reservation.status != "Completed":
            return Response({'error': 'You cannot make a comment until stay is over.'}, status=status.HTTP_403_FORBIDDEN)

        #check that no comment has been made for this reservation
        comment = CommentChain.objects.filter(reservation=reservation)
        if comment:
            return Response({'error': 'You have already made a comment for this reservation.'}, status=status.HTTP_403_FORBIDDEN)

        owner = reservation.property.owner
        user = self.request.user
        
        # check if the user has a request for the reservation
        request = Request.objects.filter(user=user, reservation=reservation)
        if not request:
            return Response({'error': 'You have not made a request for this reservation.'}, status=status.HTTP_403_FORBIDDEN)
        

        # Set the user field of the reservation to the current user
        serializer.save(user=user, host=owner, reservation=reservation, comment=new_comment)

        return Response(serializer.data, status = status.HTTP_201_CREATED)

class CreateUserRating(CreateAPIView):
    serializer_class = UserRatingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Get the rental property object from the request data
        user_id = self.kwargs['pk']
        user = get_object_or_404(CustomUser, id=user_id)
        host = self.request.user

        # check that user has a request with a reservation that is completed for a property owned by the host
        request = Request.objects.filter(user=user, reservation__user=host, reservation__status="Completed")
        if not request:
            return Response({'error': 'You cannot comment on this user'}, status=status.HTTP_403_FORBIDDEN)

        # check that no comment has been made for this reservation
        comment = UserRating.objects.filter(user=user, host=host)
        if comment:
            return Response({'error': 'You have already made a comment for this user.'}, status=status.HTTP_403_FORBIDDEN)

        # Set the user field of the reservation to the current user
        serializer.save(user=user, host=host)
        return Response(serializer.data, status = status.HTTP_201_CREATED)

class UpdateCommentView(UpdateAPIView):
    serializer_class = CommentChainSerializer
    permission_classes = [IsAuthenticated] 

    def put(self, request, *args, **kwargs):
        new_comment = request.data.get('comment')
        if new_comment:
            user = self.request.user
            comment_id = self.kwargs['pk']
            comment = get_object_or_404(CommentChain, id=comment_id)

            if comment.userresponse:
                return Response({'error': 'This comment chain is complete.'}, status=status.HTTP_403_FORBIDDEN)
            
            if comment.hostresponse:
                if user != comment.user:
                    return Response({'error': 'You cannot respond to this.'}, status = status.HTTP_403_FORBIDDEN)
                comment.userresponse = new_comment
                
            else:
                if user == comment.host:
                    return Response({'error': 'You cannot respond to this.'}, status = status.HTTP_403_FORBIDDEN)
                comment.hostresponse = new_comment
                
            comment.save()

            return Response({'success': 'New Comment!'}, status=status.HTTP_200_OK)

        else:
            return Response({'error': 'You must write something'}, status = status.HTTP_403_FORBIDDEN)

class ViewPropertyCommentChain(ListAPIView):
    serializer_class = CommentChainSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        # Get the rental property object from the request data
        property_id = self.kwargs['pk']
        property = get_object_or_404(RentalProperty, id=property_id)

        # Get the comment chain object from the database based on the URL parameter
        query_set = CommentChain.objects.filter(reservation__property=property)

        return query_set

class ViewUserRatings(ListAPIView):
    serializer_class = UserRatingSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        # Get the rental property object from the request data
        user_id = self.kwargs['pk']
        user = get_object_or_404(CustomUser, id=user_id)
        host = self.request.user

        #check if user has a request for a reservation for a property owned by request.user
        requests = Request.objects.filter(reservation__property__owner=host, user=user)
        if not requests:
            return Response({'error': 'You cannot view this user'}, status=status.HTTP_403_FORBIDDEN)

        # Get the comment chain object from the database based on the URL parameter
        query_set = UserRating.objects.filter(user=user)

        return query_set  



