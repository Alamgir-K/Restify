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
from ..serializers.property import PropertyCreateSerializer, PropertyEditSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework import filters
from rest_framework.parsers import MultiPartParser, FormParser

class PropertyCreateView(CreateAPIView):
    serializer_class = PropertyCreateSerializer
    permission_classes = [IsAuthenticated]
    parser_class = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = PropertyCreateSerializer(data = request.data)
        
        if serializer.is_valid():
            user = get_object_or_404(CustomUser, user=self.request.user)
            is_host = user.is_host
            if not is_host:
                user.is_host = True
                user.save()
            property = serializer.save(owner = user)

            # images_serializer = PropertyImageSerializer(data=request.data.getlist('images'), many=True)
            # images_serializer.is_valid(raise_exception=True)
            # images_serializer.save(property=property)

            return Response(serializer.data, status = status.HTTP_201_CREATED)

        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

class PropertyDeleteView(DestroyAPIView):
    serializer_class = PropertyCreateSerializer
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
    serializer_class = PropertyEditSerializer
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

        serializer = PropertyEditSerializer(instance=property, data=request.data, partial=True)
        # partial = True indicates that only a subset of the field will be updated

        if serializer.is_valid():
            serializer.save() # basically it is calling serializer.update() with the new info

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# also add a view property 

class PropertySearchView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = PropertyCreateSerializer
    pagination_class = PageNumberPagination
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['price', 'max_guests']

    def get_queryset(self):
        queryset = RentalProperty.objects.all()

        max_guests = self.request.query_params.get('max_guests')
        if max_guests:
            queryset = queryset.filter(max_guests__gte=max_guests)

        beds = self.request.query_params.get('beds')
        if beds:
            queryset = queryset.filter(beds__gte=beds)

        baths = self.request.query_params.get('baths')
        if baths:
            queryset = queryset.filter(baths__gte=baths)

        city = self.request.query_params.get('city')
        if city:
            queryset = queryset.filter(city__icontains=city)

        country = self.request.query_params.get('country')
        if country:
            queryset = queryset.filter(country__icontains=country)

        amenities = self.request.query_params.get('amenities')
        if amenities:
            queryset = queryset.filter(amenities__contains=amenities)
        
        return queryset


        
    




        