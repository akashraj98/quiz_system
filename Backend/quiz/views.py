from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import Quiz, Question, QuizAttempt
from .serializers import (
    QuizSerializer,
    QuizCreateSerializer,
    AnswerSubmissionSerializer,
    QuizResultSerializer,
)


class QuizCreateView(generics.CreateAPIView):
    """
    POST /api/quizzes/
    Create a new quiz with nested questions.
    
    Validations:
    - Quiz must have at least one question
    - MCQ questions must have at least 2 options
    """
    queryset = Quiz.objects.all()
    serializer_class = QuizCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class QuizDetailView(generics.RetrieveAPIView):
    """
    GET /api/quizzes/{id}/
    Retrieve a quiz by ID for taking.
    
    - Returns quiz with all questions
    - Does NOT expose correct_answer (uses QuizSerializer)
    - Returns 404 for non-existent quiz
    """
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    lookup_field = 'pk'


class QuizSubmitView(APIView):
    """
    POST /api/quizzes/{id}/submit/
    Submit quiz answers and get results.
    
    - Compares user answers to correct answers
    - Creates QuizAttempt record
    - Returns detailed results with score
    - Unanswered questions are treated as incorrect
    """

    def post(self, request, pk):
        # Get the quiz or return 404
        quiz = get_object_or_404(Quiz, pk=pk)
        
        # Validate the submitted answers
        serializer = AnswerSubmissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user_answers = serializer.validated_data['answers']
        questions = quiz.questions.all()
        
        # Calculate score and build results
        score = 0
        total_questions = questions.count()
        results = []
        
        for question in questions:
            question_id_str = str(question.id)
            user_answer = user_answers.get(question_id_str, '')
            is_correct = user_answer == question.correct_answer
            
            if is_correct:
                score += 1
            
            results.append({
                'question_id': question.id,
                'question_text': question.question_text,
                'user_answer': user_answer if user_answer else None,
                'correct_answer': question.correct_answer,
                'is_correct': is_correct,
            })
        
        # Calculate percentage
        percentage = (score / total_questions * 100) if total_questions > 0 else 0
        
        # Create QuizAttempt record
        QuizAttempt.objects.create(
            quiz=quiz,
            answers=user_answers,
            score=score,
            total_questions=total_questions,
        )
        
        # Build and return response
        response_data = {
            'score': score,
            'total_questions': total_questions,
            'percentage': percentage,
            'results': results,
        }
        
        result_serializer = QuizResultSerializer(data=response_data)
        result_serializer.is_valid(raise_exception=True)
        
        return Response(result_serializer.data, status=status.HTTP_200_OK)
