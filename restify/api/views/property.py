from django.shortcuts import render

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import CreateAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView, ListAPIView
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework.authentication import TokenAuthentication

from ..models.user import CustomUser
from ..models.rentalproperty import RentalProperty, PropertyImage
from ..serializers.property import PropertySerializer

from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import SearchFilter, OrderingFilter

class PropertyCreateView(CreateAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PropertySerializer(data = request.data)
        
        if serializer.is_valid():
            user = get_object_or_404(CustomUser, user=self.request.user)
            is_host = user.is_host
            if not is_host:
                user.is_host = True
                user.save()
            property = serializer.save(owner = user)

            # images = request.FILES.getlist('images')
            # for image in images:
            #     PropertyImage.objects.create(property = property, image = image)

            return Response(serializer.data, status = status.HTTP_201_CREATED)

        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

class PropertyDeleteView(DestroyAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        primary_key = self.kwargs['pk']
        property = get_object_or_404(RentalProperty, pk = primary_key)

        # Check if the user is the owner of the property
        user = get_object_or_404(CustomUser, user=self.request.user)
        if property.owner != user:
            return Response({'error': 'You are not the owner of this property.'}, status = status.HTTP_403_FORBIDDEN)

        # Delete the property
        property.delete()

        # Check if the user has any other properties as an owner
        properties = RentalProperty.objects.filter(owner = user)
        if not properties.exists():
            user.is_host = False
            user.save()

        return Response({'success': 'Property Deleted!'}, status = status.HTTP_204_NO_CONTENT)

class PropertyEditView(UpdateAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        property_id = self.kwargs.get('pk')
        property = get_object_or_404(RentalProperty, pk=property_id)

        return property

    def put(self, request, *args, **kwargs):
        property = self.get_object()

        user = get_object_or_404(CustomUser, user=self.request.user)
        if property.owner != user:
            return Response({'error': 'You are not the owner of this property.'}, status = status.HTTP_403_FORBIDDEN)

        serializer = PropertySerializer(instance=property, data=request.data, partial=True)
        # partial = True indicates that only a subset of the field will be updated

        if serializer.is_valid():
            serializer.save() # basically it is calling serializer.update() with the new info

            # if 'images' in request.data:
            #     images = request.FILES.getlist('images')
            #     for image in images:
            #         if image.size == 0:  # check if file is empty
            #             return Response({'error': 'Empty file uploaded.'}, status=status.HTTP_400_BAD_REQUEST)
            #         elif imgae.size > 5242800:
            #             return Response({'error': 'File size too large. Maximum file size is 5 MB.'}, status=status.HTTP_400_BAD_REQUEST)
            #         else:
            #             PropertyImage.objects.create(property=property, image=image)

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# also add a view property 

# class PropertyListView(ListAPIView):
#     queryset = RentalProperty.objects.all()
#     serializer_class = PropertySerializer
#     permission_classes = (AllowAny,)
#     pagination_class = PageNumberPagination
#     filter_backends = (SearchFilter, OrderingFilter)
#     search_fileds = ('city', 'country', 'max_guest') # add amenities 


        
    




        