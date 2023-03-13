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

from ..serializers.user import CustomUserSerializer
from ..models.user import CustomUser
from ..models.rentalproperty import RentalProperty, PropertyImage
from ..serializers.property import PropertySerializer

class PropertyCreateView(CreateAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PropertySerializer(data=request.data)
        
        if serializer.is_valid():
            is_host = request.user.is_host
            if not is_host:
                request.user.is_host = True
                request.user.save()
            serializer.save(owner = request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PropertyDeleteView(DestroyAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        property = get_object_or_404(Property.objects.all(), pk=pk)

        # Check if the user is the owner of the property
        if property.owner != request.user:
            return Response({'error': 'You are not the owner of this property.'}, status=status.HTTP_403_FORBIDDEN)

        # Delete the property
        property.delete()

        # Check if the user has any other properties as an owner
        properties = Property.objects.filter(owner=request.user)
        if not properties.exists():
            request.user.is_host = False
            request.user.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

class PropertyEditView(UpdateAPIView):

        