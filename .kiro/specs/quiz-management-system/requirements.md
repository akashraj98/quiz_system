# Requirements Document

## Introduction

This document outlines the requirements for a Quiz Management System to be built within a 2-hour timeframe. The system consists of a Django backend with Django REST Framework, a React frontend with Tailwind CSS and Material UI, and SQLite database for persistence.

The system enables administrators to create quizzes with multiple question types (MCQ, True/False) and allows public users to take quizzes and view their results. The focus is on delivering a production-ready MVP with core functionality working reliably.

### Assumptions
- No user authentication required for MVP
- Admin creates quizzes via a simple UI
- Public users access quizzes via direct URL (no login required)
- No quiz editing after creation
- No timer functionality
- No image support for questions

### Out of Scope
- User authentication/authorization
- Quiz editing functionality
- Complex question types beyond MCQ and True/False
- Question images
- Timer functionality
- Deployment configuration

---

## Requirements

### Requirement 1: Quiz Creation (Admin)

**User Story:** As an admin, I want to create quizzes with a title and multiple questions, so that I can publish quizzes for public users to take.

#### Acceptance Criteria

1. WHEN an admin accesses the admin page THEN the system SHALL display a quiz creation form with a title input field.
2. WHEN an admin enters a quiz title THEN the system SHALL validate that the title is not empty.
3. WHEN an admin clicks "Add Question" THEN the system SHALL add a new question form with question type selector (MCQ, True/False).
4. WHEN an admin selects MCQ as question type THEN the system SHALL display input fields for question text, multiple options (minimum 2), and correct answer selection.
5. WHEN an admin selects True/False as question type THEN the system SHALL display input fields for question text and correct answer selection (True or False).
6. WHEN an admin submits a quiz with at least one question THEN the system SHALL save the quiz to the database and display a success message with the quiz ID/link.
7. IF a quiz submission has no questions THEN the system SHALL display an error message and prevent submission.
8. IF a MCQ question has fewer than 2 options THEN the system SHALL display an error message and prevent submission.

### Requirement 2: Quiz Retrieval (Public)

**User Story:** As a public user, I want to access a quiz by its ID, so that I can view and answer the questions.

#### Acceptance Criteria

1. WHEN a user navigates to a quiz URL with a valid quiz ID THEN the system SHALL display the quiz title and all questions.
2. WHEN displaying MCQ questions THEN the system SHALL show the question text and all answer options as selectable choices.
3. WHEN displaying True/False questions THEN the system SHALL show the question text with True and False as selectable options.
4. IF a user navigates to a quiz URL with an invalid quiz ID THEN the system SHALL display a "Quiz not found" error message.
5. WHEN a quiz is displayed THEN the system SHALL NOT reveal the correct answers before submission.

### Requirement 3: Quiz Submission and Results

**User Story:** As a public user, I want to submit my answers and see my results, so that I can know how well I performed on the quiz.

#### Acceptance Criteria

1. WHEN a user selects answers for all questions and clicks submit THEN the system SHALL send the answers to the backend for scoring.
2. WHEN the backend receives quiz answers THEN the system SHALL calculate the score by comparing user answers to correct answers.
3. WHEN scoring is complete THEN the system SHALL return the score (correct answers / total questions) to the frontend.
4. WHEN results are received THEN the system SHALL display the user's score and indicate which answers were correct/incorrect.
5. WHEN results are displayed THEN the system SHALL show the correct answer for each question.
6. IF a user submits without answering all questions THEN the system SHALL allow submission and treat unanswered questions as incorrect.

### Requirement 4: Backend API

**User Story:** As a developer, I want well-structured REST API endpoints, so that the frontend can interact with the backend reliably.

#### Acceptance Criteria

1. WHEN a POST request is made to `/api/quizzes/` with valid quiz data THEN the system SHALL create a new quiz and return the quiz ID with 201 status.
2. WHEN a GET request is made to `/api/quizzes/{id}/` THEN the system SHALL return the quiz details including all questions (without correct answers).
3. WHEN a POST request is made to `/api/quizzes/{id}/submit/` with user answers THEN the system SHALL return the score and detailed results.
4. IF an API request contains invalid data THEN the system SHALL return appropriate error messages with 400 status.
5. IF an API request references a non-existent quiz THEN the system SHALL return a 404 status with error message.

### Requirement 5: Data Persistence

**User Story:** As a system administrator, I want quiz data to be persisted in a database, so that quizzes and attempts are stored reliably.

#### Acceptance Criteria

1. WHEN a quiz is created THEN the system SHALL store the quiz title, questions, options, and correct answers in SQLite database.
2. WHEN a quiz attempt is submitted THEN the system SHALL store the attempt with user answers and calculated score.
3. WHEN the system restarts THEN all previously created quizzes SHALL be available for retrieval.

### Requirement 6: User Interface

**User Story:** As a user, I want a clean and responsive interface, so that I can easily create and take quizzes on any device.

#### Acceptance Criteria

1. WHEN the admin page loads THEN the system SHALL display a styled form using Tailwind CSS and Material UI components.
2. WHEN the quiz taking page loads THEN the system SHALL display questions in a clear, readable format.
3. WHEN viewing on mobile devices THEN the system SHALL display a responsive layout that adapts to screen size.
4. WHEN an API request is in progress THEN the system SHALL display a loading indicator.
5. WHEN an error occurs THEN the system SHALL display a user-friendly error message.
