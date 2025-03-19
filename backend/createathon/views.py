from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics

from .serializers import UserSerializer, RegisterSerializer,QuestionSerializer,SubmissionSerializer
from .models import CustomUser,Question,Submission

User = get_user_model()

class RegisterView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({"message": "You are authenticated"}, status=status.HTTP_200_OK)

class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
class UserDetailView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'  
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
class QuestionListAPI(APIView):
    def get(self, request):
        questions = Question.objects.all()
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
class QuestionDetailAPI(APIView):
    def get_object(self, pk):
        try:
            return Question.objects.get(pk=pk)
        except Question.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        question = self.get_object(pk)
        serializer = QuestionSerializer(question)
        return Response(serializer.data, status=status.HTTP_200_OK)
class SubmissionCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        mutable_data = request.data.copy()
        mutable_data['user_id'] = request.user.id
        
        serializer = SubmissionSerializer(data=mutable_data)
        
        if serializer.is_valid():
            submission = serializer.save()
            user = request.user
            user.attempted_questions += 1
            user.save()
            
            return Response({
                'message': 'Submission created successfully',
                'submission': serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'message': 'Submission failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
class UserSubmissionsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id=None):
        try:
            if user_id is None:
                user_id = request.user.id
            
            if not CustomUser.objects.filter(id=user_id).exists():
                return Response({
                    'message': 'User not found'
                }, status=status.HTTP_404_NOT_FOUND)

            submissions = Submission.objects.filter(user_id=user_id)
            
            serializer = SubmissionSerializer(submissions, many=True)
            
            return Response({
                'message': 'Submissions retrieved successfully',
                'count': submissions.count(),
                'submissions': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'message': 'An error occurred',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)