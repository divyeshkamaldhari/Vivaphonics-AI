import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/api';
import { toast } from 'react-hot-toast';

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // Ensure the role has correct capitalization
      const formattedUserData = {
        ...userData,
        role: userData.role === 'admin' ? 'Admin' : userData.role
      };
      
      const response = await authService.register(formattedUserData);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || 'Registration failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      localStorage.removeItem('token');
    } catch (error) {
      const message = error.response?.data?.message || 'Logout failed';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  userInfo: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
    },
    clearCredentials: (state) => {
      state.userInfo = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.userInfo = action.payload.user;
        state.token = action.payload.token;
        toast.success('Registration successful');
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.userInfo = action.payload.user;
        state.token = action.payload.token;
        toast.success('Login successful');
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout cases
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.userInfo = null;
        state.token = null;
        toast.success('Logged out successfully');
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        // Still clear state even if logout API fails
        state.isAuthenticated = false;
        state.userInfo = null;
        state.token = null;
      });
  },
});

export const { setCredentials, clearCredentials, setError, clearError } = authSlice.actions;
export default authSlice.reducer; 