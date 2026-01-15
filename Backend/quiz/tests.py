"""
Integration tests for the Quiz Management System.
Tests complete quiz creation flow, quiz taking flow, and error handling scenarios.
"""
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Quiz, Question, QuizAttempt


class QuizCreationFlowTests(APITestCase):
    """Test complete quiz creation flow (Requirement 1, 4.1, 4.4, 5.1)"""

    def test_create_quiz_with_mcq_questions(self):
        """Test creating a quiz with MCQ questions"""
        url = '/api/quizzes/'
        data = {
            "title": "Math Quiz",
            "questions": [
                {
                    "question_text": "What is 2 + 2?",
                    "question_type": "mcq",
                    "options": ["3", "4", "5", "6"],
                    "correct_answer": "4"
                },
                {
                    "question_text": "What is 10 / 2?",
                    "question_type": "mcq",
                    "options": ["3", "4", "5", "6"],
                    "correct_answer": "5"
                }
            ]
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Math Quiz')
        self.assertEqual(len(response.data['questions']), 2)
        self.assertIn('id', response.data)
        
        # Verify database persistence
        quiz = Quiz.objects.get(id=response.data['id'])
        self.assertEqual(quiz.title, 'Math Quiz')
        self.assertEqual(quiz.questions.count(), 2)

    def test_create_quiz_with_true_false_questions(self):
        """Test creating a quiz with True/False questions"""
        url = '/api/quizzes/'
        data = {
            "title": "Science Quiz",
            "questions": [
                {
                    "question_text": "The sky is blue.",
                    "question_type": "tf",
                    "options": ["True", "False"],
                    "correct_answer": "True"
                },
                {
                    "question_text": "Water boils at 50°C.",
                    "question_type": "tf",
                    "options": ["True", "False"],
                    "correct_answer": "False"
                }
            ]
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(response.data['questions']), 2)

    def test_create_quiz_with_mixed_question_types(self):
        """Test creating a quiz with both MCQ and True/False questions"""
        url = '/api/quizzes/'
        data = {
            "title": "Mixed Quiz",
            "questions": [
                {
                    "question_text": "What is the capital of France?",
                    "question_type": "mcq",
                    "options": ["London", "Paris", "Berlin", "Madrid"],
                    "correct_answer": "Paris"
                },
                {
                    "question_text": "Python is a programming language.",
                    "question_type": "tf",
                    "options": ["True", "False"],
                    "correct_answer": "True"
                }
            ]
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        questions = response.data['questions']
        self.assertEqual(questions[0]['question_type'], 'mcq')
        self.assertEqual(questions[1]['question_type'], 'tf')

    def test_create_quiz_without_questions_fails(self):
        """Test that creating a quiz without questions returns 400 error (Requirement 1.7)"""
        url = '/api/quizzes/'
        data = {
            "title": "Empty Quiz",
            "questions": []
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_quiz_mcq_with_less_than_2_options_fails(self):
        """Test that MCQ with less than 2 options returns 400 error (Requirement 1.8)"""
        url = '/api/quizzes/'
        data = {
            "title": "Invalid Quiz",
            "questions": [
                {
                    "question_text": "Single option question",
                    "question_type": "mcq",
                    "options": ["Only one"],
                    "correct_answer": "Only one"
                }
            ]
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_quiz_without_title_fails(self):
        """Test that creating a quiz without title returns 400 error (Requirement 1.2)"""
        url = '/api/quizzes/'
        data = {
            "title": "",
            "questions": [
                {
                    "question_text": "Test question",
                    "question_type": "mcq",
                    "options": ["A", "B"],
                    "correct_answer": "A"
                }
            ]
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class QuizRetrievalFlowTests(APITestCase):
    """Test complete quiz retrieval flow (Requirement 2, 4.2, 4.5)"""

    def setUp(self):
        """Create a test quiz for retrieval tests"""
        self.quiz = Quiz.objects.create(title="Test Quiz")
        Question.objects.create(
            quiz=self.quiz,
            question_text="What is 2 + 2?",
            question_type="mcq",
            options=["3", "4", "5", "6"],
            correct_answer="4",
            order=0
        )
        Question.objects.create(
            quiz=self.quiz,
            question_text="The Earth is flat.",
            question_type="tf",
            options=["True", "False"],
            correct_answer="False",
            order=1
        )

    def test_get_quiz_by_id(self):
        """Test retrieving a quiz by ID (Requirement 2.1)"""
        url = f'/api/quizzes/{self.quiz.id}/'
        
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Quiz')
        self.assertEqual(len(response.data['questions']), 2)

    def test_get_quiz_does_not_expose_correct_answer(self):
        """Test that correct_answer is NOT exposed in GET response (Requirement 2.5)"""
        url = f'/api/quizzes/{self.quiz.id}/'
        
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for question in response.data['questions']:
            self.assertNotIn('correct_answer', question)

    def test_get_quiz_displays_mcq_options(self):
        """Test that MCQ questions show all options (Requirement 2.2)"""
        url = f'/api/quizzes/{self.quiz.id}/'
        
        response = self.client.get(url)
        
        mcq_question = response.data['questions'][0]
        self.assertEqual(mcq_question['question_type'], 'mcq')
        self.assertEqual(len(mcq_question['options']), 4)

    def test_get_quiz_displays_tf_options(self):
        """Test that True/False questions show True/False options (Requirement 2.3)"""
        url = f'/api/quizzes/{self.quiz.id}/'
        
        response = self.client.get(url)
        
        tf_question = response.data['questions'][1]
        self.assertEqual(tf_question['question_type'], 'tf')

    def test_get_nonexistent_quiz_returns_404(self):
        """Test that non-existent quiz returns 404 (Requirement 2.4, 4.5)"""
        url = '/api/quizzes/99999/'
        
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class QuizSubmissionFlowTests(APITestCase):
    """Test complete quiz submission and results flow (Requirement 3, 4.3, 5.2)"""

    def setUp(self):
        """Create a test quiz for submission tests"""
        self.quiz = Quiz.objects.create(title="Submission Test Quiz")
        self.q1 = Question.objects.create(
            quiz=self.quiz,
            question_text="What is 2 + 2?",
            question_type="mcq",
            options=["3", "4", "5", "6"],
            correct_answer="4",
            order=0
        )
        self.q2 = Question.objects.create(
            quiz=self.quiz,
            question_text="The sky is blue.",
            question_type="tf",
            options=["True", "False"],
            correct_answer="True",
            order=1
        )
        self.q3 = Question.objects.create(
            quiz=self.quiz,
            question_text="What is 10 - 5?",
            question_type="mcq",
            options=["3", "4", "5", "6"],
            correct_answer="5",
            order=2
        )

    def test_submit_quiz_all_correct(self):
        """Test submitting quiz with all correct answers (Requirement 3.1, 3.2, 3.3)"""
        url = f'/api/quizzes/{self.quiz.id}/submit/'
        data = {
            "answers": {
                str(self.q1.id): "4",
                str(self.q2.id): "True",
                str(self.q3.id): "5"
            }
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['score'], 3)
        self.assertEqual(response.data['total_questions'], 3)
        self.assertEqual(response.data['percentage'], 100.0)

    def test_submit_quiz_partial_correct(self):
        """Test submitting quiz with some correct answers"""
        url = f'/api/quizzes/{self.quiz.id}/submit/'
        data = {
            "answers": {
                str(self.q1.id): "4",      # Correct
                str(self.q2.id): "False",  # Incorrect
                str(self.q3.id): "3"       # Incorrect
            }
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['score'], 1)
        self.assertEqual(response.data['total_questions'], 3)
        self.assertAlmostEqual(response.data['percentage'], 33.33, places=1)

    def test_submit_quiz_all_incorrect(self):
        """Test submitting quiz with all incorrect answers"""
        url = f'/api/quizzes/{self.quiz.id}/submit/'
        data = {
            "answers": {
                str(self.q1.id): "3",
                str(self.q2.id): "False",
                str(self.q3.id): "6"
            }
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['score'], 0)
        self.assertEqual(response.data['percentage'], 0.0)

    def test_submit_quiz_with_unanswered_questions(self):
        """Test that unanswered questions are treated as incorrect (Requirement 3.6)"""
        url = f'/api/quizzes/{self.quiz.id}/submit/'
        data = {
            "answers": {
                str(self.q1.id): "4"  # Only answer one question
            }
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['score'], 1)
        self.assertEqual(response.data['total_questions'], 3)

    def test_submit_quiz_returns_detailed_results(self):
        """Test that results include detailed question-by-question feedback (Requirement 3.4, 3.5)"""
        url = f'/api/quizzes/{self.quiz.id}/submit/'
        data = {
            "answers": {
                str(self.q1.id): "4",
                str(self.q2.id): "False",
                str(self.q3.id): "5"
            }
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results']
        self.assertEqual(len(results), 3)
        
        # Check first result (correct)
        self.assertEqual(results[0]['user_answer'], '4')
        self.assertEqual(results[0]['correct_answer'], '4')
        self.assertTrue(results[0]['is_correct'])
        
        # Check second result (incorrect)
        self.assertEqual(results[1]['user_answer'], 'False')
        self.assertEqual(results[1]['correct_answer'], 'True')
        self.assertFalse(results[1]['is_correct'])

    def test_submit_quiz_creates_attempt_record(self):
        """Test that quiz submission creates QuizAttempt record (Requirement 5.2)"""
        url = f'/api/quizzes/{self.quiz.id}/submit/'
        data = {
            "answers": {
                str(self.q1.id): "4",
                str(self.q2.id): "True",
                str(self.q3.id): "5"
            }
        }
        
        initial_count = QuizAttempt.objects.count()
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(QuizAttempt.objects.count(), initial_count + 1)
        
        attempt = QuizAttempt.objects.latest('submitted_at')
        self.assertEqual(attempt.quiz, self.quiz)
        self.assertEqual(attempt.score, 3)
        self.assertEqual(attempt.total_questions, 3)

    def test_submit_nonexistent_quiz_returns_404(self):
        """Test that submitting to non-existent quiz returns 404"""
        url = '/api/quizzes/99999/submit/'
        data = {"answers": {}}
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class DataPersistenceTests(APITestCase):
    """Test data persistence requirements (Requirement 5)"""

    def test_quiz_persists_after_creation(self):
        """Test that quiz data persists in database (Requirement 5.1, 5.3)"""
        # Create quiz via API
        url = '/api/quizzes/'
        data = {
            "title": "Persistence Test Quiz",
            "questions": [
                {
                    "question_text": "Test question",
                    "question_type": "mcq",
                    "options": ["A", "B", "C"],
                    "correct_answer": "A"
                }
            ]
        }
        
        response = self.client.post(url, data, format='json')
        quiz_id = response.data['id']
        
        # Verify quiz exists in database
        quiz = Quiz.objects.get(id=quiz_id)
        self.assertEqual(quiz.title, "Persistence Test Quiz")
        self.assertEqual(quiz.questions.count(), 1)
        
        # Verify question data
        question = quiz.questions.first()
        self.assertEqual(question.question_text, "Test question")
        self.assertEqual(question.correct_answer, "A")
        self.assertEqual(question.options, ["A", "B", "C"])

    def test_quiz_attempt_persists_after_submission(self):
        """Test that quiz attempt data persists (Requirement 5.2)"""
        # Create quiz
        quiz = Quiz.objects.create(title="Attempt Persistence Test")
        q1 = Question.objects.create(
            quiz=quiz,
            question_text="Test",
            question_type="mcq",
            options=["A", "B"],
            correct_answer="A",
            order=0
        )
        
        # Submit quiz
        url = f'/api/quizzes/{quiz.id}/submit/'
        data = {"answers": {str(q1.id): "A"}}
        
        self.client.post(url, data, format='json')
        
        # Verify attempt persists
        attempt = QuizAttempt.objects.get(quiz=quiz)
        self.assertEqual(attempt.score, 1)
        self.assertEqual(attempt.total_questions, 1)
        self.assertEqual(attempt.answers, {str(q1.id): "A"})


class ErrorHandlingTests(APITestCase):
    """Test error handling scenarios (Requirement 4.4, 4.5, 6.5)"""

    def test_invalid_json_returns_400(self):
        """Test that invalid JSON returns 400 error"""
        url = '/api/quizzes/'
        
        response = self.client.post(
            url, 
            'invalid json', 
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_missing_required_fields_returns_400(self):
        """Test that missing required fields returns 400 error"""
        url = '/api/quizzes/'
        data = {"questions": []}  # Missing title
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_question_type_returns_400(self):
        """Test that invalid question type returns 400 error"""
        url = '/api/quizzes/'
        data = {
            "title": "Test Quiz",
            "questions": [
                {
                    "question_text": "Test",
                    "question_type": "invalid_type",
                    "options": ["A", "B"],
                    "correct_answer": "A"
                }
            ]
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_quiz_with_order_in_question_data(self):
        """Test that quiz creation works when order is included in question data from frontend"""
        url = '/api/quizzes/'
        data = {
            "title": "Quiz with Order",
            "questions": [
                {
                    "question_text": "First question",
                    "question_type": "mcq",
                    "options": ["A", "B", "C"],
                    "correct_answer": "A",
                    "order": 0  # Frontend sends order
                },
                {
                    "question_text": "Second question",
                    "question_type": "tf",
                    "options": ["True", "False"],
                    "correct_answer": "True",
                    "order": 1  # Frontend sends order
                }
            ]
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(response.data['questions']), 2)
        # Verify questions are ordered correctly
        self.assertEqual(response.data['questions'][0]['order'], 0)
        self.assertEqual(response.data['questions'][1]['order'], 1)
