from django.urls import path
from .views import QuizCreateView, QuizDetailView, QuizSubmitView

urlpatterns = [
    path('quizzes/', QuizCreateView.as_view(), name='quiz-create'),
    path('quizzes/<int:pk>/', QuizDetailView.as_view(), name='quiz-detail'),
    path('quizzes/<int:pk>/submit/', QuizSubmitView.as_view(), name='quiz-submit'),
]
