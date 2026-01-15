import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

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
