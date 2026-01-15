from django.db import models


class Quiz(models.Model):
    """Stores quiz metadata including title and creation timestamp."""
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "quizzes"

    def __str__(self):
        return self.title


class Question(models.Model):
    """Stores question data with foreign key to Quiz."""
    QUESTION_TYPES = [
        ('mcq', 'Multiple Choice'),
        ('tf', 'True/False'),
    ]

    quiz = models.ForeignKey(Quiz, related_name='questions', on_delete=models.CASCADE)
    question_text = models.TextField()
    question_type = models.CharField(max_length=10, choices=QUESTION_TYPES)
    options = models.JSONField(default=list)  # For MCQ: ["Option A", "Option B", ...]
    correct_answer = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.quiz.title} - Q{self.order + 1}: {self.question_text[:50]}"


class QuizAttempt(models.Model):
    """Stores quiz submission results."""
    quiz = models.ForeignKey(Quiz, related_name='attempts', on_delete=models.CASCADE)
    answers = models.JSONField(default=dict)  # {question_id: user_answer}
    score = models.PositiveIntegerField()
    total_questions = models.PositiveIntegerField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.quiz.title} - Score: {self.score}/{self.total_questions}"
