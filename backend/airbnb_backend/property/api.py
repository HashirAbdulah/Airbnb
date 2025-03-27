from django.http import JsonResponse
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from .models import Property, Reservation
from .serializers import (
    PropertiesListSerializer,
    PropertiesDetailSerializer,
    ReservationsListSerializer,  # noqa
)
from .forms import PropertyForm
from rest_framework import status  # noqa
from datetime import datetime  # noqa
from django.core.exceptions import ObjectDoesNotExist  # noqa
from useraccounts.models import User  # noqa


@api_view(["GET"])
@authentication_classes([])
@permission_classes([])
def properties_list(request):
    properites = Property.objects.all()
    serializer = PropertiesListSerializer(properites, many=True)

    return JsonResponse({"data": serializer.data})


@api_view(["GET"])
@authentication_classes([])
@permission_classes([])
def properties_detail(request, pk):
    property = Property.objects.get(pk=pk)
    serializer = PropertiesDetailSerializer(property, many=False)
    return JsonResponse({"data": serializer.data})


@api_view(["POST"])
def create_property(request):
    print("Received POST data:")
    # for key, value in request.POST.items():
    #     print(f"Field: {key} = {value}")
    # print("--------------------------------")

    # Check each file in request.FILES
    print("Received FILE data:")
    # for key, file in request.FILES.items():
    #     print(f"File: {key} = {file.name} (Size: {file.size} bytes)")
    # print("--------------------------------")

    form = PropertyForm(request.POST, request.FILES)
    if form.is_valid():
        property = form.save(commit=False)
        property.landlord = request.user
        property.save()

        return JsonResponse(
            {
                "success": True,
                "message": "Property created successfully.",
                "id": str(property.id),
            }
        )
    else:
        print("Errors:", form.errors, form.non_field_errors())
        return JsonResponse({"errors": form.errors.as_json()}, status=400)


@api_view(["POST"])
def book_property(request, pk):
    try:
        start_date = request.POST.get("start_date", "")
        end_date = request.POST.get("end_date", "")
        number_of_nights = request.POST.get("number_of_nights", "")
        total_price = request.POST.get("total_price", "")
        guests = request.POST.get("guests", "")

        property = Property.objects.get(pk=pk)

        Reservation.objects.create(
            property=property,
            start_date=start_date,
            end_date=end_date,
            number_of_nights=number_of_nights,
            total_price=total_price,
            guests=guests,
            created_by=request.user,
        )

        return JsonResponse({"success": True})
    except Exception as e:
        print("Error", e)

        return JsonResponse({"success": False})


@api_view(["GET"])
@authentication_classes([])
@permission_classes([])
def property_reservations(request, pk):
    property = Property.objects.get(pk=pk)
    reservations = property.reservations.all()
    serializer = ReservationsListSerializer(reservations, many=True)
    return JsonResponse({"data": serializer.data}, safe=False)
