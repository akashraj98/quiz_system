import { 
  Box, 
  Typography, 
  Paper,
  Divider,
  Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

/**
 * ResultsDisplay component for showing quiz results after submission
 * Displays score, percentage, and detailed question-by-question results
 * 
 * @param {Object} props
 * @param {Object} props.results - Results object from API containing score, total_questions, percentage, and results array
 */
function ResultsDisplay({ results }) {
  const { score, total_questions, percentage, results: questionResults } = results;

  // Determine score color based on percentage
  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Box>
      {/* Score Summary */}
      <Box className="text-center mb-8">
        <Typography variant="h4" component="h1" className="font-bold mb-4">
          Quiz Results
        </Typography>
        
        <Box className="flex justify-center items-center gap-4 mb-4">
          <Paper elevation={2} className="p-6 inline-block">
            <Typography variant="h2" component="div" className={`font-bold ${getScoreColor()}`}>
              {score} / {total_questions}
            </Typography>
            <Typography variant="h5" className={`mt-2 ${getScoreColor()}`}>
              {percentage}%
            </Typography>
          </Paper>
        </Box>

        <Chip 
          label={percentage >= 60 ? 'Passed' : 'Needs Improvement'}
          color={percentage >= 60 ? 'success' : 'error'}
          size="large"
          className="text-lg px-4 py-2"
        />
      </Box>

      <Divider className="my-6" />

      {/* Detailed Results */}
      <Typography variant="h5" component="h2" className="font-semibold mb-4">
        Question Details
      </Typography>

      <Box className="space-y-4">
        {questionResults?.map((result, index) => (
          <QuestionResult key={result.question_id} result={result} index={index} />
        ))}
      </Box>
    </Box>
  );
}


/**
 * Individual question result component
 * Shows question text, user answer, correct answer, and correct/incorrect status
 */
function QuestionResult({ result, index }) {
  const { question_text, user_answer, correct_answer, is_correct } = result;

  return (
    <Paper 
      elevation={1} 
      className={`p-4 border-l-4 ${is_correct ? 'border-l-green-500 bg-green-50' : 'border-l-red-500 bg-red-50'}`}
    >
      <Box className="flex items-start gap-3">
        {/* Status Icon */}
        <Box className="flex-shrink-0 mt-1">
          {is_correct ? (
            <CheckCircleIcon className="text-green-600" fontSize="medium" />
          ) : (
            <CancelIcon className="text-red-600" fontSize="medium" />
          )}
        </Box>

        {/* Question Content */}
        <Box className="flex-grow">
          <Typography variant="subtitle1" className="font-medium mb-2">
            Question {index + 1}
          </Typography>
          <Typography variant="body1" className="mb-3">
            {question_text}
          </Typography>

          {/* Answers */}
          <Box className="space-y-2">
            {/* User's Answer */}
            <Box className="flex items-center gap-2">
              <Typography variant="body2" className="font-medium text-gray-600 min-w-[120px]">
                Your answer:
              </Typography>
              <Typography 
                variant="body2" 
                className={`font-medium ${is_correct ? 'text-green-700' : 'text-red-700'}`}
              >
                {user_answer || '(No answer)'}
              </Typography>
            </Box>

            {/* Correct Answer (only show if incorrect) */}
            {!is_correct && (
              <Box className="flex items-center gap-2">
                <Typography variant="body2" className="font-medium text-gray-600 min-w-[120px]">
                  Correct answer:
                </Typography>
                <Typography variant="body2" className="font-medium text-green-700">
                  {correct_answer}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Status Badge */}
        <Box className="flex-shrink-0">
          <Chip 
            label={is_correct ? 'Correct' : 'Incorrect'}
            size="small"
            color={is_correct ? 'success' : 'error'}
            variant="filled"
          />
        </Box>
      </Box>
    </Paper>
  );
}

export default ResultsDisplay;
