from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import QuizCreateView, QuizDetailView, QuizSubmitView
from .auth_views import SignupView, LoginView

urlpatterns = [
    # Auth endpoints
    path('auth/signup/', SignupView.as_view(), name='auth-signup'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='auth-refresh'),
    
    # Quiz endpoints
    path('quizzes/', QuizCreateView.as_view(), name='quiz-create'),
    path('quizzes/<int:pk>/', QuizDetailView.as_view(), name='quiz-detail'),
    path('quizzes/<int:pk>/submit/', QuizSubmitView.as_view(), name='quiz-submit'),
]
