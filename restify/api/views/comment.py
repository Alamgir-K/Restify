from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView, UpdateAPIView, ListAPIView
from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination

from ..models.user import CustomUser
from ..models.rentalproperty import RentalProperty
from ..models.reservation import Reservation
from ..models.comments import UserRating, CommentChain
from ..serializers.comment import UserRatingSerializer, CommentChainUpdateSerializer, CommentChainCreateSerializer


class CreateCommentView(CreateAPIView):
    serializer_class = CommentChainCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Get the rental property object from the request data
        reservation_id = self.request.data.get('reservation')
        new_comment = self.request.data.get('comment')
        reservation = get_object_or_404(Reservation, id=reservation_id)

        owner = reservation.property.owner
        user = get_object_or_404(CustomUser, user=self.request.user)
        # user = self.request.user.custom_user

        if reservation.user != user:
            return Response({'error': 'This is not your reservation.'}, status=status.HTTP_403_FORBIDDEN)

        if reservation.status not in ["Completed", "Cancelled"]: 
            return Response({'error': 'You cannot make a comment until stay is over.'}, status=status.HTTP_403_FORBIDDEN)

        #check that no comment has been made for this reservation
        comment = CommentChain.objects.filter(reservation=reservation)
        if comment:
            return Response({'error': 'You have already made a comment for this reservation.'}, status=status.HTTP_403_FORBIDDEN)
        

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
        host = self.request.user.custom_user

        # check that user has reservation that is completed or cancelled for a property owned by the host
        res = Reservation.objects.filter(user=user, property__owner=host, status__in=["Completed", "Cancelled"])
        if not res:
            return Response({'error': 'You cannot comment on this user'}, status=status.HTTP_403_FORBIDDEN)

        # check that no comment has been made for this reservation
        comment = UserRating.objects.filter(user=user, host=host)
        if comment:
            return Response({'error': 'You have already made a rating for this user.'}, status=status.HTTP_403_FORBIDDEN)

        # Set the user field of the reservation to the current user
        serializer.save(user=user, host=host)
        return Response(serializer.data, status = status.HTTP_201_CREATED)

class UpdateCommentView(UpdateAPIView):
    serializer_class = CommentChainUpdateSerializer
    permission_classes = [IsAuthenticated] 

    def put(self, request, *args, **kwargs):
        new_comment = request.data.get('message')
        if new_comment:
            user = self.request.user.custom_user
            comment_id = self.kwargs['pk']
            comment = get_object_or_404(CommentChain, id=comment_id)

            if comment.userresponse:
                return Response({'error': 'This comment chain is complete.'}, status=status.HTTP_403_FORBIDDEN)
            
            if comment.hostresponse:
                if user != comment.user:
                    return Response({'error': 'You cannot respond to this.'}, status = status.HTTP_403_FORBIDDEN)
                comment.userresponse = new_comment
                
            else:
                if user != comment.host:

                    return Response({'error': 'You cannot respond to this.'}, status = status.HTTP_403_FORBIDDEN)
                comment.hostresponse = new_comment
                
            comment.save()

            serializer = CommentChainUpdateSerializer(comment)
            return Response(serializer.data)

        else:
            return Response({'error': 'You must write something'}, status = status.HTTP_403_FORBIDDEN)

class ViewPropertyCommentChain(ListAPIView):
    serializer_class = CommentChainCreateSerializer
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
        host = self.request.user.custom_user

        #check if user has a request for a reservation for a property owned by request.user
        # res = Reservation.objects.filter(property__owner=host, user=user)
        # if not res:
        #     return Response({'error': 'You cannot view this user'}, status=status.HTTP_403_FORBIDDEN)

        # Get the comment chain object from the database based on the URL parameter
        query_set = UserRating.objects.filter(user=user)

        return query_set  



