from .serializers import UserDetailSerializer  # noqa
from .models import User  # noqa
from django.http import JsonResponse  # noqa
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)  # noqa


@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def landlord_detail(request, pk):
    user = User.objects.get(pk=pk)

    serializer = UserDetailSerializer(user, many=False)

    return JsonResponse(serializer.data, safe=False)
