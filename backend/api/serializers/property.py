from rest_framework import serializers
from ..models.user import CustomUser
from ..models.rentalproperty import RentalProperty
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

# class PropertyImageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = PropertyImage
#         fields = '__all__'

class PropertyCreateSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.user.firstname')
    owner_id = serializers.ReadOnlyField(source='owner.id')

    # images = PropertyImageSerializer(many=True, required=False, read_only = True)
    # uploaded_images = serializers.ListField(
    #     child=serializers.ImageField(allow_empty_file=False, use_url=False),
    #     write_only=True, required=False
    # )

    amenities = serializers.MultipleChoiceField(choices=RentalProperty.AMENITIES_CHOICES, required=False, allow_blank=True)

    class Meta:
        # serializers works just like django forms
        model = RentalProperty

        fields = ['id', 'owner_username', 'owner_id', 'name', 'address', 'city', 'country', 'price', 'max_guests', 'beds', 'baths', 'main_image', 'img1', 'img2', 'img3', 'img4', 'description', 'amenities']


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

class PropertyEditSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.user.firstname')
    owner_id = serializers.ReadOnlyField(source='owner.id')

    # images = PropertyImageSerializer(many=True, required=False, read_only = True)
    # uploaded_images = serializers.ListField(
    #     child=serializers.ImageField(allow_empty_file=False, use_url=False),
    #     write_only=True, required=False
    # )
    # deleted_images = serializers.ListField(
    #     child=serializers.IntegerField(),
    #     write_only=True,
    #     required=False
    # )

    amenities = serializers.MultipleChoiceField(choices=RentalProperty.AMENITIES_CHOICES, required=False, allow_blank=True)

    class Meta:
        # serializers works just like django forms
        model = RentalProperty

        fields = ['id', 'owner_username', 'owner_id', 'name', 'address', 'city', 'country', 'price', 'max_guests', 'beds', 'baths', 'main_image', 'img1', 'img2', 'img3', 'img4', 'description', 'amenities']
        read_only_fields = ['id', 'owner_username', 'owner_id', 'city', 'country']


    def update(self, instance, validated_data):
        name = validated_data.get('name')
        if name:
            instance.name = name

        address = validated_data.get('address')
        if address:
            instance.address = address

        price = validated_data.get('price')
        if price:
            instance.price = price

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

        if 'img1' in validated_data:
            instance.img1 = validated_data.get('img1')
        
        if 'img2' in validated_data:
            instance.img2 = validated_data.get('img2')

        if 'img3' in validated_data:
            instance.img3 = validated_data.get('img3')
        
        if 'img4' in validated_data:
            instance.img4 = validated_data.get('img4')

        main_image = validated_data.get('main_image')
        if main_image:
            instance.main_image = main_image
        
        instance.save()
        return instance

        

