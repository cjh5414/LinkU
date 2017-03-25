from .serializer import MeetingSerializer
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Meeting, User


class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer


@api_view(['POST'])
def signup(request):
    User.objects.create(
        nickname=request.data['nickname'],
        gender=request.data['gender'],
        email=request.data['email'],
        password=request.data['password'],
        authenticated_university_email=request.data['authenticated_university_email'],
        is_authenticated_university_student=request.data['is_authenticated_university_student'],
    )
    return Response({"message": "Signed up"})
