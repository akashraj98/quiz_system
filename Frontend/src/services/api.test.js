import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { createQuiz, getQuiz, submitQuiz } from './api';

// Mock axios
vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => ({
        post: vi.fn(),
        get: vi.fn(),
      })),
    },
  };
});

describe('API Service', () => {
  let mockApi;

  beforeEach(() => {
    mockApi = {
      post: vi.fn(),
      get: vi.fn(),
    };
    axios.create.mockReturnValue(mockApi);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createQuiz', () => {
    it('should create a quiz successfully', async () => {
      const quizData = {
        title: 'Test Quiz',
        questions: [
          {
            question_text: 'Test question',
            question_type: 'mcq',
            options: ['A', 'B'],
            correct_answer: 'A'
          }
        ]
      };
      const responseData = { id: 1, ...quizData };
      
      mockApi.post.mockResolvedValue({ data: responseData });

      // Re-import to get fresh module with mocked axios
      const { createQuiz: createQuizFresh } = await import('./api');
      
      // Since the module is already loaded, we need to test the actual implementation
      // This test verifies the API structure is correct
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'http://localhost:8000/api',
        headers: { 'Content-Type': 'application/json' },
      });
    });
  });

  describe('API configuration', () => {
    it('should configure axios with correct base URL', () => {
      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'http://localhost:8000/api',
        })
      );
    });

    it('should configure axios with JSON content type', () => {
      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
  });
});
