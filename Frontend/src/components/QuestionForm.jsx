import {
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Button,
  Box,
  Typography,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';

function QuestionForm({ question, index, onUpdate, onRemove, errors = {} }) {
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    onUpdate({
      ...question,
      question_type: newType,
      options: newType === 'mcq' ? ['', ''] : ['True', 'False'],
      correct_answer: '',
    });
  };

  const handleQuestionTextChange = (e) => {
    onUpdate({ ...question, question_text: e.target.value });
  };

  const handleOptionChange = (optIndex, value) => {
    const newOptions = [...question.options];
    newOptions[optIndex] = value;
    onUpdate({ ...question, options: newOptions });
  };

  const handleAddOption = () => {
    onUpdate({ ...question, options: [...question.options, ''] });
  };

  const handleRemoveOption = (optIndex) => {
    if (question.options.length <= 2) return;
    const newOptions = question.options.filter((_, i) => i !== optIndex);
    // Reset correct answer if it was the removed option
    const removedOption = question.options[optIndex];
    const newCorrectAnswer = question.correct_answer === removedOption ? '' : question.correct_answer;
    onUpdate({ ...question, options: newOptions, correct_answer: newCorrectAnswer });
  };

  const handleCorrectAnswerChange = (e) => {
    onUpdate({ ...question, correct_answer: e.target.value });
  };

  return (
    <Paper elevation={2} className="p-4 mb-4">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h6">Question {index + 1}</Typography>
        <IconButton
          color="error"
          onClick={onRemove}
          aria-label="Remove question"
        >
          <DeleteIcon />
        </IconButton>
      </Box>

      <Box className="grid gap-4">
        <FormControl fullWidth>
          <InputLabel>Question Type</InputLabel>
          <Select
            value={question.question_type}
            label="Question Type"
            onChange={handleTypeChange}
          >
            <MenuItem value="mcq">Multiple Choice</MenuItem>
            <MenuItem value="tf">True/False</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Question Text"
          value={question.question_text}
          onChange={handleQuestionTextChange}
          multiline
          rows={2}
          error={!!errors.question_text}
          helperText={errors.question_text}
        />

        {question.question_type === 'mcq' && (
          <Box>
            <Typography variant="subtitle2" className="mb-2">
              Options
            </Typography>
            {errors.options && (
              <FormHelperText error className="mb-2">
                {errors.options}
              </FormHelperText>
            )}
            {question.options.map((option, optIndex) => (
              <Box key={optIndex} className="flex items-center gap-2 mb-2">
                <TextField
                  fullWidth
                  size="small"
                  label={`Option ${optIndex + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(optIndex, e.target.value)}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveOption(optIndex)}
                  disabled={question.options.length <= 2}
                  aria-label="Remove option"
                >
                  <RemoveIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddOption}
            >
              Add Option
            </Button>
          </Box>
        )}

        <FormControl error={!!errors.correct_answer}>
          <FormLabel>Correct Answer</FormLabel>
          <RadioGroup
            value={question.correct_answer}
            onChange={handleCorrectAnswerChange}
          >
            {question.question_type === 'mcq' ? (
              question.options
                .filter((opt) => opt.trim())
                .map((option, optIndex) => (
                  <FormControlLabel
                    key={optIndex}
                    value={option}
                    control={<Radio />}
                    label={option}
                  />
                ))
            ) : (
              <>
                <FormControlLabel value="True" control={<Radio />} label="True" />
                <FormControlLabel value="False" control={<Radio />} label="False" />
              </>
            )}
          </RadioGroup>
          {errors.correct_answer && (
            <FormHelperText>{errors.correct_answer}</FormHelperText>
          )}
        </FormControl>
      </Box>
    </Paper>
  );
}

export default QuestionForm;
