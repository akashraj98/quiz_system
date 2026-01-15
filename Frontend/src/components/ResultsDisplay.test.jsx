import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResultsDisplay from './ResultsDisplay';

describe('ResultsDisplay', () => {
  const mockResults = {
    score: 2,
    total_questions: 3,
    percentage: 66.67,
    results: [
      {
        question_id: 1,
        question_text: 'What is 2 + 2?',
        user_answer: '4',
        correct_answer: '4',
        is_correct: true
      },
      {
        question_id: 2,
        question_text: 'The sky is green.',
        user_answer: 'True',
        correct_answer: 'False',
        is_correct: false
      },
      {
        question_id: 3,
        question_text: 'What is 10 - 5?',
        user_answer: '5',
        correct_answer: '5',
        is_correct: true
      }
    ]
  };

  it('displays the score and percentage', () => {
    render(<ResultsDisplay results={mockResults} />);

    expect(screen.getByText('2 / 3')).toBeInTheDocument();
    expect(screen.getByText('66.67%')).toBeInTheDocument();
  });

  it('displays Quiz Results heading', () => {
    render(<ResultsDisplay results={mockResults} />);

    expect(screen.getByText('Quiz Results')).toBeInTheDocument();
  });

  it('displays all question results', () => {
    render(<ResultsDisplay results={mockResults} />);

    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
    expect(screen.getByText('The sky is green.')).toBeInTheDocument();
    expect(screen.getByText('What is 10 - 5?')).toBeInTheDocument();
  });

  it('shows correct answers with Correct chip', () => {
    render(<ResultsDisplay results={mockResults} />);

    const correctChips = screen.getAllByText('Correct');
    expect(correctChips.length).toBe(2);
  });

  it('shows incorrect answers with Incorrect chip', () => {
    render(<ResultsDisplay results={mockResults} />);

    const incorrectChips = screen.getAllByText('Incorrect');
    expect(incorrectChips.length).toBe(1);
  });

  it('displays user answers', () => {
    render(<ResultsDisplay results={mockResults} />);

    // Check that user answers are displayed
    const userAnswerLabels = screen.getAllByText('Your answer:');
    expect(userAnswerLabels.length).toBe(3);
  });

  it('displays correct answer for incorrect questions', () => {
    render(<ResultsDisplay results={mockResults} />);

    // The correct answer should be shown for incorrect questions
    expect(screen.getByText('Correct answer:')).toBeInTheDocument();
    expect(screen.getByText('False')).toBeInTheDocument();
  });

  it('shows Passed chip for passing score', () => {
    render(<ResultsDisplay results={mockResults} />);

    expect(screen.getByText('Passed')).toBeInTheDocument();
  });

  it('shows Needs Improvement chip for failing score', () => {
    const failingResults = {
      ...mockResults,
      score: 1,
      percentage: 33.33
    };
    render(<ResultsDisplay results={failingResults} />);

    expect(screen.getByText('Needs Improvement')).toBeInTheDocument();
  });
});
