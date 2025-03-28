# Create your models here.
import uuid  # noqa: F401
from django.conf import settings  # noqa
from django.db import models  # noqa
from useraccounts.models import User  # noqa


class Property(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()
    price_per_night = models.IntegerField()
    guests = models.IntegerField()
    bedrooms = models.IntegerField()
    bathrooms = models.IntegerField()
    country = models.CharField(max_length=255)
    country_code = models.CharField(max_length=7)
    category = models.CharField(max_length=200)
    image = models.ImageField(upload_to="uploads/properties")
    landlord = models.ForeignKey(
        User, related_name="properties", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def image_url(self):
        return f"{settings.WEBSITE_URL}{self.image.url}"


class Reservation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property = models.ForeignKey(Property, related_name='reservations', on_delete=models.CASCADE)
    # guest = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    number_of_nights = models.IntegerField()
    guests = models.IntegerField()
    total_price = models.FloatField()
    created_by = models.ForeignKey(User, related_name='created_reservations', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Reservation for {self.property.title} by {self.created_by}"
