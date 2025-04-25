import axios from 'axios';

// Create an axios instance with base URL and common headers
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true, // This enables sending cookies with requests
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Log detailed error information in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Full error details:', error);
      console.log('Request URL:', error.config?.url);
      console.log('Request method:', error.config?.method);
      console.log('Request data:', error.config?.data);
    }
    
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },
  
  // Login user
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },
  
  // Logout user
  logout: async () => {
    const response = await api.post('/users/logout');
    return response.data;
  },
};

// Student services
export const studentService = {
  // Get all students
  getStudents: async () => {
    const response = await api.get('/students');
    return response.data;
  },
  
  // Get student by ID
  getStudent: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },
  
  // Create a new student
  createStudent: async (studentData) => {
    const response = await api.post('/students', studentData);
    return response.data;
  },
  
  // Update a student
  updateStudent: async (id, studentData) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
  },
  
  // Delete a student
  deleteStudent: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },
};

// Add other services (tutor, session, payment) as needed

export default api; 