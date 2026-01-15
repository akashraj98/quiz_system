import { 
  Box, 
  Typography, 
  FormControl, 
  RadioGroup, 
  FormControlLabel, 
  Radio,
  Paper
} from '@mui/material';

/**
 * QuestionDisplay component for rendering quiz questions
 * Supports MCQ and True/False question types
 * 
 * @param {Object} props
 * @param {Object} props.question - Question object with id, question_text, question_type, options
 * @param {number} props.index - Question index (0-based)
 * @param {string} props.selectedAnswer - Currently selected answer
 * @param {Function} props.onAnswerChange - Callback when answer changes (questionId, answer)
 */
function QuestionDisplay({ question, index, selectedAnswer, onAnswerChange }) {
  const handleChange = (event) => {
    onAnswerChange(question.id, event.target.value);
  };

  // For True/False questions, use fixed options
  const options = question.question_type === 'tf' 
    ? ['True', 'False'] 
    : question.options || [];

  return (
    <Paper elevation={1} className="p-4 mb-4">
      <Box className="mb-3">
        <Typography variant="h6" component="h3" className="font-medium">
          Question {index + 1}
        </Typography>
        <Typography variant="body1" className="mt-2">
          {question.question_text}
        </Typography>
      </Box>

      <FormControl component="fieldset" className="w-full">
        <RadioGroup
          name={`question-${question.id}`}
          value={selectedAnswer || ''}
          onChange={handleChange}
        >
          {options.map((option, optionIndex) => (
            <FormControlLabel
              key={optionIndex}
              value={option}
              control={<Radio />}
              label={option}
              className="my-1 p-2 rounded hover:bg-gray-50 transition-colors"
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Paper>
  );
}

export default QuestionDisplay;
