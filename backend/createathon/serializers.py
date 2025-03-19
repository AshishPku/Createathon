from rest_framework import serializers
from .models import CustomUser,Question,Submission

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'bio', 
            'no_of_questions_solved', 'attempted_questions', 'badges_earned', 'earned_points'
        ]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
class QuestionSerializer(serializers.ModelSerializer):
    difficulty_display = serializers.CharField(source='get_difficulties_display', read_only=True)
    
    class Meta:
        model = Question
        fields = ['id', 'title', 'description', 'difficulties', 'difficulty_display']
class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ['id', 'user_id', 'question_id', 'code', 'languages', 'status', 'submitted_at']
        read_only_fields = ['id', 'status', 'submitted_at']

    def validate(self, data):
        if not CustomUser.objects.filter(id=data['user_id'].id).exists():
            raise serializers.ValidationError("User does not exist")
        
        if not Question.objects.filter(id=data['question_id'].id).exists():
            raise serializers.ValidationError("Question does not exist")
        
        allowed_languages = ['python', 'java', 'cpp', 'javascript','typescript']  # Add more as needed
        if data['languages'].lower() not in allowed_languages:
            raise serializers.ValidationError(f"Language must be one of: {', '.join(allowed_languages)}")
        
        return data