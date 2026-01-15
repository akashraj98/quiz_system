import { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Alert,
  CircularProgress,
  Link,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Add as AddIcon, Send as SendIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import QuestionForm from '../components/QuestionForm';
import { createQuiz } from '../services/api';
import { useAuth } from '../context/AuthContext';

function AdminPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const createEmptyQuestion = () => ({
    id: Date.now(),
    question_text: '',
    question_type: 'mcq',
    options: ['', ''],
    correct_answer: '',
  });

  const handleAddQuestion = () => {
    setQuestions([...questions, createEmptyQuestion()]);
    // Clear the "no questions" error when adding a question
    if (errors.questions) {
      setErrors((prev) => ({ ...prev, questions: null }));
    }
  };

  const handleUpdateQuestion = (index, updatedQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate title
    if (!title.trim()) {
      newErrors.title = 'Quiz title is required';
    }

    // Validate at least one question
    if (questions.length === 0) {
      newErrors.questions = 'At least one question is required';
    }

    // Validate each question
    const questionErrors = questions.map((q, index) => {
      const qErrors = {};
      
      if (!q.question_text.trim()) {
        qErrors.question_text = 'Question text is required';
      }

      if (q.question_type === 'mcq') {
        const validOptions = q.options.filter((opt) => opt.trim());
        if (validOptions.length < 2) {
          qErrors.options = 'MCQ must have at least 2 options';
        }
      }

      if (!q.correct_answer) {
        qErrors.correct_answer = 'Correct answer is required';
      }

      return Object.keys(qErrors).length > 0 ? qErrors : null;
    });

    if (questionErrors.some((e) => e !== null)) {
      newErrors.questionErrors = questionErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Prepare quiz data for API
      const quizData = {
        title: title.trim(),
        questions: questions.map((q, index) => ({
          question_text: q.question_text.trim(),
          question_type: q.question_type,
          options: q.question_type === 'mcq' 
            ? q.options.filter((opt) => opt.trim())
            : ['True', 'False'],
          correct_answer: q.correct_answer,
          order: index,
        })),
      };

      const result = await createQuiz(quizData);
      setSuccessData(result);
      
      // Reset form
      setTitle('');
      setQuestions([]);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successData) {
    return (
      <>
        <AppBar position="static" className="mb-4">
          <Toolbar>
            <Typography variant="h6" className="flex-grow">
              Quiz Admin
            </Typography>
            <Typography variant="body2" className="mr-4">
              {user?.username}
            </Typography>
            <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" className="py-8">
          <Paper elevation={3} className="p-6">
            <Alert severity="success" className="mb-4">
              Quiz created successfully!
            </Alert>
            <Typography variant="h6" className="mb-2">
              Quiz: {successData.title}
            </Typography>
            <Typography variant="body1" className="mb-4">
              Share this link with participants:
            </Typography>
            <Box className="bg-gray-100 p-3 rounded mb-4">
              <Link
                href={`/quiz/${successData.id}`}
                target="_blank"
                rel="noopener"
              >
                {window.location.origin}/quiz/{successData.id}
              </Link>
            </Box>
            <Button
              variant="contained"
              onClick={() => setSuccessData(null)}
            >
              Create Another Quiz
            </Button>
          </Paper>
        </Container>
      </>
    );
  }

  return (
    <>
      <AppBar position="static" className="mb-4">
        <Toolbar>
          <Typography variant="h6" className="flex-grow">
            Quiz Admin
          </Typography>
          <Typography variant="body2" className="mr-4">
            {user?.username}
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" className="py-8">
      <Typography variant="h4" component="h1" className="mb-6">
        Create Quiz
      </Typography>

      <form onSubmit={handleSubmit}>
        <Paper elevation={3} className="p-6 mb-6">
          <TextField
            fullWidth
            label="Quiz Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
            }}
            error={!!errors.title}
            helperText={errors.title}
            className="mb-4"
          />
        </Paper>

        {errors.questions && (
          <Alert severity="error" className="mb-4">
            {errors.questions}
          </Alert>
        )}

        {questions.map((question, index) => (
          <QuestionForm
            key={question.id}
            question={question}
            index={index}
            onUpdate={(updated) => handleUpdateQuestion(index, updated)}
            onRemove={() => handleRemoveQuestion(index)}
            errors={errors.questionErrors?.[index]}
          />
        ))}

        <Box className="flex gap-4 mb-6">
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddQuestion}
          >
            Add Question
          </Button>
        </Box>

        {errors.submit && (
          <Alert severity="error" className="mb-4">
            {errors.submit}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          size="large"
          startIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Quiz...' : 'Create Quiz'}
        </Button>
      </form>
    </Container>
    </>
  );
}

export default AdminPage;
