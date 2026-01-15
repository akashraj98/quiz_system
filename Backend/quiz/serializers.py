from rest_framework import serializers
from .models import Quiz, Question, QuizAttempt


class QuestionSerializer(serializers.ModelSerializer):
    """
    Serializer for Question model.
    Excludes correct_answer by default for public GET requests.
    """
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'question_type', 'options', 'order']
        read_only_fields = ['id', 'order']


class QuestionWithAnswerSerializer(serializers.ModelSerializer):
    """
    Serializer for Question model that includes correct_answer.
    Used internally for quiz creation and result calculation.
    """
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'question_type', 'options', 'correct_answer', 'order']
        read_only_fields = ['id']


class QuizSerializer(serializers.ModelSerializer):
    """
    Serializer for reading quiz data with nested questions.
    Excludes correct_answer from questions for public access.
    """
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'created_at', 'questions']
        read_only_fields = ['id', 'created_at']


class QuizCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating quiz with nested questions.
    Includes correct_answer for question creation.
    """
    questions = QuestionWithAnswerSerializer(many=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'created_at', 'questions']
        read_only_fields = ['id', 'created_at']

    def validate_questions(self, value):
        """Validate that at least one question exists and MCQ has minimum 2 options."""
        if not value:
            raise serializers.ValidationError("At least one question is required.")
        
        for i, question in enumerate(value):
            if question.get('question_type') == 'mcq':
                options = question.get('options', [])
                if len(options) < 2:
                    raise serializers.ValidationError(
                        f"Question {i + 1}: MCQ questions must have at least 2 options."
                    )
        return value

    def create(self, validated_data):
        """Create quiz with nested questions."""
        questions_data = validated_data.pop('questions')
        quiz = Quiz.objects.create(**validated_data)
        
        for order, question_data in enumerate(questions_data):
            # Remove 'order' from question_data if present to avoid duplicate keyword argument
            question_data.pop('order', None)
            Question.objects.create(quiz=quiz, order=order, **question_data)
        
        return quiz


class AnswerSubmissionSerializer(serializers.Serializer):
    """
    Serializer to validate submitted answers.
    Expects answers as a dictionary: {question_id: user_answer}
    """
    answers = serializers.DictField(
        child=serializers.CharField(allow_blank=True),
        required=True
    )

    def validate_answers(self, value):
        """Validate that answers is a dictionary with string keys."""
        if not isinstance(value, dict):
            raise serializers.ValidationError("Answers must be a dictionary.")
        return value


class QuestionResultSerializer(serializers.Serializer):
    """Serializer for individual question results."""
    question_id = serializers.IntegerField()
    question_text = serializers.CharField()
    user_answer = serializers.CharField(allow_null=True, allow_blank=True)
    correct_answer = serializers.CharField()
    is_correct = serializers.BooleanField()


class QuizResultSerializer(serializers.Serializer):
    """
    Serializer to format quiz results response.
    Includes score, total questions, percentage, and detailed results.
    """
    score = serializers.IntegerField()
    total_questions = serializers.IntegerField()
    percentage = serializers.FloatField()
    results = QuestionResultSerializer(many=True)
