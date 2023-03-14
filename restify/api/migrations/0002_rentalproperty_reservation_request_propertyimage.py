# Generated by Django 4.1.7 on 2023-03-14 05:14

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import multiselectfield.db.fields
import multiselectfield.validators


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='RentalProperty',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('address', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=255)),
                ('country', models.CharField(max_length=255)),
                ('max_guests', models.PositiveIntegerField()),
                ('beds', models.PositiveIntegerField()),
                ('baths', models.PositiveIntegerField()),
                ('description', models.TextField()),
                ('amenities', multiselectfield.db.fields.MultiSelectField(blank=True, choices=[('wifi', 'WiFi'), ('tv', 'TV'), ('kitchen', 'Kitchen'), ('air_conditioning', 'Air Conditioning'), ('pool', 'Pool'), ('gym', 'Gym'), ('parking', 'Parking'), ('balcony', 'Balcony')], max_length=57, validators=[multiselectfield.validators.MaxValueMultiFieldValidator(8)])),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.customuser')),
            ],
        ),
        migrations.CreateModel(
            name='Reservation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('price', models.DecimalField(decimal_places=2, max_digits=8)),
                ('status', models.CharField(choices=[('N', 'New'), ('P', 'Pending'), ('A', 'Approved'), ('O', 'Completed'), ('T', 'Terminated')], default='N', max_length=1)),
                ('property', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reservations', to='api.rentalproperty')),
                ('user', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='reservations', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Request',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField()),
                ('guest', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(choices=[('PENDING', 'Pending'), ('ACCEPTED', 'Accepted'), ('REJECTED', 'Rejected'), ('CANCELED', 'Canceled')], default='PENDING', max_length=10)),
                ('reservation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.reservation')),
                ('user', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='PropertyImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='property')),
                ('property', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='api.rentalproperty')),
            ],
        ),
    ]