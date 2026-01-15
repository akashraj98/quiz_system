import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const tokens = localStorage.getItem('tokens');
  if (tokens) {
    const { access } = JSON.parse(tokens);
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const tokens = localStorage.getItem('tokens');
      if (tokens) {
        try {
          const { refresh } = JSON.parse(tokens);
          const response = await axios.post(
            'http://localhost:8000/api/auth/refresh/',
            { refresh }
          );
          
          const newTokens = {
            access: response.data.access,
            refresh: response.data.refresh || refresh,
          };
          localStorage.setItem('tokens', JSON.stringify(newTokens));
          
          originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear auth state
          localStorage.removeItem('user');
          localStorage.removeItem('tokens');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Sign up a new user
 */
export const signup = async (username, email, password) => {
  try {
    const response = await api.post('/auth/signup/', { username, email, password });
    return response.data;
  } catch (error) {
    if (error.response?.data?.errors) {
      const fieldErrors = error.response.data.errors;
      const err = new Error('Validation failed');
      err.fieldErrors = fieldErrors;
      throw err;
    }
    throw new Error(error.response?.data?.error || 'Signup failed');
  }
};

/**
 * Login user
 */
export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login/', { username, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

/**
 * Create a new quiz with questions
 * @param {Object} quizData - Quiz data containing title and questions array
 * @returns {Promise<Object>} Created quiz with ID
 */
export const createQuiz = async (quizData) => {
  try {
    const response = await api.post("/quizzes/", quizData);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      const errorMessage =
        error.response.data?.detail ||
        error.response.data?.message ||
        (typeof error.response.data === "object"
          ? JSON.stringify(error.response.data)
          : "Failed to create quiz");
      throw new Error(errorMessage);
    } else if (error.request) {
      // Request made but no response received
      throw new Error(
        "Connection error. Please check your network and try again."
      );
    }
    throw new Error("An unexpected error occurred while creating the quiz.");
  }
};

/**
 * Get a quiz by ID (without correct answers)
 * @param {number|string} id - Quiz ID
 * @returns {Promise<Object>} Quiz data with questions
 */
export const getQuiz = async (id) => {
  try {
    const response = await api.get(`/quizzes/${id}/`);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error("Quiz not found");
      }
      const errorMessage = error.response.data?.detail || "Failed to load quiz";
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error(
        "Connection error. Please check your network and try again."
      );
    }
    throw new Error("An unexpected error occurred while loading the quiz.");
  }
};

/**
 * Submit quiz answers and get results
 * @param {number|string} id - Quiz ID
 * @param {Object} answers - Object mapping question IDs to user answers
 * @returns {Promise<Object>} Quiz results with score and detailed feedback
 */
export const submitQuiz = async (id, answers) => {
  try {
    const response = await api.post(`/quizzes/${id}/submit/`, { answers });
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error("Quiz not found");
      }
      const errorMessage =
        error.response.data?.detail ||
        error.response.data?.message ||
        "Failed to submit quiz";
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error(
        "Connection error. Please check your network and try again."
      );
    }
    throw new Error("An unexpected error occurred while submitting the quiz.");
  }
};

export default api;
