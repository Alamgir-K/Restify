from rest_framework import serializers
from ..models.user import CustomUser
from ..models.rentalproperty import RentalProperty, PropertyImage
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = '__all__'

class PropertySerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.user.username')

    images = PropertyImageSerializer(many=True, required=False, read_only = True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True, required=False
    )
    deleted_images = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )

    amenities = serializers.MultipleChoiceField(choices=RentalProperty.AMENITIES_CHOICES, required=False, allow_blank=True)

    read_only_fields = ['owner', 'city', 'country']

    class Meta:
        # serializers works just like django forms
        model = RentalProperty
        fields = ['id', 'owner_username', 'name', 'address', 'city', 'country', 'max_guests', 'beds', 'baths', 'description', 'amenities', 'images', 'uploaded_images', 'deleted_images']

    def validate_amenities(self, value):
        if len(value) > 8:
            raise serializers.ValidationError("You may select up to 8 amenities.")
        return value

    def create(self, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", None)
        property = RentalProperty.objects.create(**validated_data)

        if uploaded_images:
            for image in uploaded_images:
                PropertyImage.objects.create(property=property, image=image)

        return property

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
            ex_list = instance.amenities
            for amenity in amenities:
                if amenity not in ex_list:
                    ex_list.append(amenity)
                else:
                    ex_list.remove(amenity)
            instance.amenities = ex_list

        uploaded_images = validated_data.get('uploaded_images')
        if uploaded_images:
            for image in uploaded_images:
                PropertyImage.objects.create(property = instance, image=image)

        deleted_images = validated_data.get('deleted_images')
        if deleted_images:
            for img_id in deleted_images:
                try:
                    image = PropertyImage.objects.get(id=img_id, property=instance)
                    image.delete()
                except PropertyImage.DoesNotExist:
                    pass

        
        instance.save()
        return instance

        


