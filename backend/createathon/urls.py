from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView,TokenObtainPairView
from .views import RegisterView, protected_view,UserListView,UserDetailView,QuestionListAPI,QuestionDetailAPI,SubmissionCreateAPIView,UserSubmissionsAPIView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected/', protected_view, name='protected'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:id>/', UserDetailView.as_view(), name='user-detail'),
    path('questions/', QuestionListAPI.as_view(), name='question-list-api'),
    path('questions/<int:pk>/', QuestionDetailAPI.as_view(), name='question-detail-api'),
    path('submissions/', SubmissionCreateAPIView.as_view(), name='submission-create'),
    path('submissions/user/', UserSubmissionsAPIView.as_view(), name='user-submissions-current'),
]