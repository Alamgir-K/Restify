# Generated by Django 4.1.7 on 2023-04-20 03:34

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import multiselectfield.db.fields
import multiselectfield.validators


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('phone_number', models.CharField(max_length=20)),
                ('avatar', models.ImageField(blank=True, upload_to='avatars/')),
                ('is_host', models.BooleanField(default=False)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='custom_user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='RentalProperty',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('address', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=255)),
                ('country', models.CharField(max_length=255)),
                ('price', models.FloatField(validators=[django.core.validators.MinValueValidator(0.0)])),
                ('max_guests', models.PositiveIntegerField()),
                ('beds', models.PositiveIntegerField()),
                ('baths', models.PositiveIntegerField()),
                ('main_image', models.ImageField(upload_to='property')),
                ('img1', models.ImageField(blank=True, null=True, upload_to='property')),
                ('img2', models.ImageField(blank=True, null=True, upload_to='property')),
                ('img3', models.ImageField(blank=True, null=True, upload_to='property')),
                ('img4', models.ImageField(blank=True, null=True, upload_to='property')),
                ('description', models.TextField()),
                ('amenities', multiselectfield.db.fields.MultiSelectField(blank=True, choices=[('wifi', 'WiFi'), ('tv', 'TV'), ('kitchen', 'Kitchen'), ('air_conditioning', 'Air Conditioning'), ('pool', 'Pool'), ('gym', 'Gym'), ('parking', 'Parking'), ('balcony', 'Balcony')], max_length=57, validators=[multiselectfield.validators.MaxValueMultiFieldValidator(8)])),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='properties', to='api.customuser')),
            ],
        ),
        migrations.CreateModel(
            name='UserRating',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.IntegerField(default=None, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)])),
                ('comment', models.TextField(default=None)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('host', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='host_rating', to='api.customuser')),
                ('user', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='user_rating', to='api.customuser')),
            ],
        ),
        migrations.CreateModel(
            name='Reservation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('message', models.TextField(default=None)),
                ('guest', models.IntegerField()),
                ('status', models.CharField(choices=[('P', 'Pending'), ('D', 'Denied'), ('A', 'Approved'), ('O', 'Completed'), ('C', 'Cancelled'), ('T', 'Terminated')], default='P', max_length=1)),
                ('property', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reservations', to='api.rentalproperty')),
                ('user', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='reservations', to='api.customuser')),
            ],
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('is_read', models.BooleanField(default=False)),
                ('is_cleared', models.BooleanField(default=False)),
                ('message', models.TextField(default=None)),
                ('reservation', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='api.reservation')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to='api.customuser')),
            ],
        ),
        migrations.CreateModel(
            name='CommentChain',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('Rating', models.IntegerField(default=None)),
                ('comment', models.TextField()),
                ('hostresponse', models.TextField(blank=True, default=None, null=True)),
                ('userresponse', models.TextField(blank=True, default=None, null=True)),
                ('host', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='api.customuser')),
                ('reservation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='api.reservation')),
                ('user', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='api.customuser')),
            ],
        ),
    ]
