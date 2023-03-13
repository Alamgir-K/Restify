from rest_framework import serializers
from ..models.user import CustomUser
from ..models.rentalproperty import RentalProperty, PropertyImage
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

# class ImageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = PropertyImage
#         fields = '__all__'


class PropertySerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.user.username')
    # images = serializers.ListField(child=serializers.ImageField(), required=False)
    # amenities = serializers.MultipleChoiceField(choices=RentalProperty.AMENITIES_CHOICES, required=False)
    # amenities = serializers.ListField(child=serializers.ChoiceField(choices=RentalProperty.AMENITIES_CHOICES), required=False)

    # images = ImageSerializer(many = True, required = False)
    read_only_fields = ['owner', 'city', 'country']

    class Meta:
        # serializers works just like django forms
        model = RentalProperty
        fields = ['owner_username', 'name', 'address', 'city', 'country', 'max_guests', 'beds', 'baths', 'description']

    # def create(self, validated_data):
    #     amenities = set(validated_data.pop('amenities', []))
    #     rental_property = RentalProperty.objects.create(**validated_data)
    #     if amenities:
    #         for amenity in amenities:
    #             rental_property.amenities.add(amenity)
    #     return rental_property

  
    def update(self, instance, validated_data):
        name = validated_data.get('name')
        if name:
            instance.name = name

        address = validated_data.get('address')
        if address:
            instance.address = address

        max_guests = validated_data.get('max_guests')
        if max_guests:
            instance.max_guests = max_guests

        beds = validated_data.get('beds')
        if beds:
            instance.beds = beds   

        baths = validated_data.get('baths')
        if baths:
            instance.baths = baths

        description = validated_data.get('description')
        if description:
            instance.description = description

        amenities = validated_data.get('amenities')
        if amenities:
            instance.amenities = amenities

        # if 'images' in self.context['request'].data:
        #     # indicating that the user has uploaded some images

        #     images = self.context['request'].FILES.getlist('images')

        #     # FILES contains the list of images -> usually uploaded files can 
        #     # be accessed in this way in django. 
        #     # We use getlist to access all the images that were uploaded

        #     for image in images:
        #         if image.size > 5000000:
        #             raise serializers.ValidationError(
        #                 {"image": "Image size needs to be 5MB!"}
        #             )
        #         elif image.size == 0:
        #             raise serializers.ValidationError(
        #                 {"image": "File empty"}
        #             )
        #         PropertyImage.objects.create(property=instance, image=image)
                # for every image that was uploaded we create a PropertyImage 
                # object so then we can access them later on 

        # double check on this one
        # might need to make a separete view for deleting images 
        # if 'deleted_images' in self.context['request'].data:
        #     deleted_images = self.context['request'].data.getlist('deleted_images')
        #     for deleted_image in deleted_images:
        #         try:
        #             image = PropertyImage.objects.get(pk=deleted_image, property=instance)
        #             image.delete()
        #         except PropertyImage.DoesNotExist:
        #             pass
        
        instance.save()
        return instance

        


