from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True, null=True)
    no_of_questions_solved = models.IntegerField(default=0, help_text="Number of questions successfully solved")
    attempted_questions = models.IntegerField(default=0, help_text="Number of questions attempted")
    badges_earned = models.IntegerField(default=0, help_text="Number of badges earned")
    earned_points = models.IntegerField(default=0, help_text="Total points earned from challenges")
    groups = models.ManyToManyField(Group, related_name="customuser_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="customuser_permissions", blank=True)
    USERNAME_FIELD = 'email'  # Authenticate using email
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username

    @property
    def completed_challenges_count(self):
        return self.submissions.filter(status='accepted').count()

    @property
    def ongoing_challenges_count(self):
        return self.submissions.filter(status='pending').count()

class Question(models.Model):
    DIFFICULTY_CHOICES = (
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    )
    
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200, unique=True)
    description = models.TextField()
    difficulties = models.CharField(
        max_length=20,
        choices=DIFFICULTY_CHOICES,
        default='medium'
    )
    discussion_foreign_key = models.ForeignKey(
        'Discussion',
        on_delete=models.CASCADE,
        related_name='questions',
        null=True,
        blank=True
    )
    test_cases_foreign_key = models.ForeignKey(
        'TestCase',
        on_delete=models.CASCADE,
        related_name='questions',
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.title} ({self.get_difficulties_display()})"

    class Meta:
        ordering = ['difficulties', 'title']

# Assuming these related models exist or will be created
class Discussion(models.Model):
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Discussion for {self.questions.first().title if self.questions.exists() else 'unknown'}"

class TestCase(models.Model):
    input_data = models.TextField()
    expected_output = models.TextField()
    
    def __str__(self):
        return f"Test case for {self.questions.first().title if self.questions.exists() else 'unknown'}"
class Submission(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    )
    
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='submissions'
    )
    question_id = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name='submissions'
    )
    code = models.TextField()
    languages = models.CharField(max_length=50)  # e.g., 'python', 'java', 'cpp'
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Submission {self.id} by {self.user_id.username} for {self.question_id.title}"

    class Meta:
        ordering = ['-submitted_at']