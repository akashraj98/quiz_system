import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuestionDisplay from './QuestionDisplay';

describe('QuestionDisplay', () => {
  const mockMCQQuestion = {
    id: 1,
    question_text: 'What is 2 + 2?',
    question_type: 'mcq',
    options: ['3', '4', '5', '6'],
    order: 0
  };

  const mockTFQuestion = {
    id: 2,
    question_text: 'The sky is blue.',
    question_type: 'tf',
    options: ['True', 'False'],
    order: 1
  };

  it('renders MCQ question with all options', () => {
    const onAnswerChange = vi.fn();
    render(
      <QuestionDisplay
        question={mockMCQQuestion}
        index={0}
        selectedAnswer=""
        onAnswerChange={onAnswerChange}
      />
    );

    expect(screen.getByText('Question 1')).toBeInTheDocument();
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
    expect(screen.getByLabelText('3')).toBeInTheDocument();
    expect(screen.getByLabelText('4')).toBeInTheDocument();
    expect(screen.getByLabelText('5')).toBeInTheDocument();
    expect(screen.getByLabelText('6')).toBeInTheDocument();
  });

  it('renders True/False question with True and False options', () => {
    const onAnswerChange = vi.fn();
    render(
      <QuestionDisplay
        question={mockTFQuestion}
        index={1}
        selectedAnswer=""
        onAnswerChange={onAnswerChange}
      />
    );

    expect(screen.getByText('Question 2')).toBeInTheDocument();
    expect(screen.getByText('The sky is blue.')).toBeInTheDocument();
    expect(screen.getByLabelText('True')).toBeInTheDocument();
    expect(screen.getByLabelText('False')).toBeInTheDocument();
  });

  it('calls onAnswerChange when an option is selected', () => {
    const onAnswerChange = vi.fn();
    render(
      <QuestionDisplay
        question={mockMCQQuestion}
        index={0}
        selectedAnswer=""
        onAnswerChange={onAnswerChange}
      />
    );

    fireEvent.click(screen.getByLabelText('4'));
    expect(onAnswerChange).toHaveBeenCalledWith(1, '4');
  });

  it('shows selected answer as checked', () => {
    const onAnswerChange = vi.fn();
    render(
      <QuestionDisplay
        question={mockMCQQuestion}
        index={0}
        selectedAnswer="4"
        onAnswerChange={onAnswerChange}
      />
    );

    const radioButton = screen.getByLabelText('4');
    expect(radioButton).toBeChecked();
  });
});
