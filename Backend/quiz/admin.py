from django.contrib import admin
from .models import Quiz, Question, QuizAttempt


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')
    search_fields = ('title',)
    inlines = [QuestionInline]


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('quiz', 'question_text', 'question_type', 'order')
    list_filter = ('question_type', 'quiz')
    search_fields = ('question_text',)


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ('quiz', 'score', 'total_questions', 'submitted_at')
    list_filter = ('quiz',)
