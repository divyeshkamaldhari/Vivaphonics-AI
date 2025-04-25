import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch dashboard data
export const fetchDashboardData = createAsyncThunk(
    'dashboard/fetchDashboardData',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/api/dashboard');
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch dashboard data'
            );
        }
    }
);

const initialState = {
    metrics: {
        activeStudents: 0,
        upcomingSessions: 0,
        totalPaymentsDue: 0
    },
    charts: {
        sessionsPerWeek: [],
        sessionsByStatus: []
    },
    upcomingSessions: [],
    loading: false,
    error: null
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        clearDashboardError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.metrics = action.payload.metrics;
                state.charts = action.payload.charts;
                state.upcomingSessions = action.payload.upcomingSessions;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearDashboardError } = dashboardSlice.actions;

export default dashboardSlice.reducer; 