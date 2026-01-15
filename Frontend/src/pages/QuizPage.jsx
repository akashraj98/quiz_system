import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  Alert,
  Paper,
  Button
} from '@mui/material';
import { getQuiz, submitQuiz } from '../services/api';
import QuestionDisplay from '../components/QuestionDisplay';
import ResultsDisplay from '../components/ResultsDisplay';

function QuizPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getQuiz(id);
        setQuiz(data);
        // Initialize answers state with empty values for each question
        const initialAnswers = {};
        data.questions?.forEach(q => {
          initialAnswers[q.id] = '';
        });
        setAnswers(initialAnswers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      // Filter out empty answers and convert to the expected format
      const submissionAnswers = {};
      Object.entries(answers).forEach(([questionId, answer]) => {
        submissionAnswers[questionId] = answer;
      });
      
      const result = await submitQuiz(id, submissionAnswers);
      setResults(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="md" className="py-8">
        <Box className="flex flex-col items-center justify-center min-h-[400px]">
          <CircularProgress size={48} />
          <Typography variant="body1" className="mt-4 text-gray-600">
            Loading quiz...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Error state (including 404)
  if (error && !quiz) {
    const isNotFound = error === 'Quiz not found';
    return (
      <Container maxWidth="md" className="py-8">
        <Alert 
          severity={isNotFound ? 'warning' : 'error'} 
          className="mb-4"
        >
          {isNotFound 
            ? 'Quiz not found. Please check the URL and try again.' 
            : error}
        </Alert>
      </Container>
    );
  }

  // Results view (after submission)
  if (results) {
    return (
      <Container maxWidth="md" className="py-8">
        <Paper elevation={2} className="p-6">
          <ResultsDisplay results={results} />
        </Paper>
      </Container>
    );
  }

  // Quiz loaded successfully - taking quiz view
  return (
    <Container maxWidth="md" className="py-8">
      <Paper elevation={2} className="p-6">
        <Typography variant="h4" component="h1" className="mb-2 text-center font-bold">
          {quiz.title}
        </Typography>
        
        <Box className="mb-6">
          <Typography variant="body2" className="text-gray-600 text-center">
            {quiz.questions?.length || 0} question{quiz.questions?.length !== 1 ? 's' : ''}
          </Typography>
        </Box>

        {/* Error alert for submission errors */}
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Questions */}
        <Box className="space-y-4 mb-6">
          {quiz.questions?.map((question, index) => (
            <QuestionDisplay
              key={question.id}
              question={question}
              index={index}
              selectedAnswer={answers[question.id]}
              onAnswerChange={handleAnswerChange}
            />
          ))}
        </Box>

        {/* Submit button */}
        <Box className="flex justify-center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={submitting}
            className="min-w-[200px]"
          >
            {submitting ? (
              <>
                <CircularProgress size={20} color="inherit" className="mr-2" />
                Submitting...
              </>
            ) : (
              'Submit Quiz'
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default QuizPage;
