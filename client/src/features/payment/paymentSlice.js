import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    payments: [],
    loading: false,
    error: null
};

export const calculatePayments = createAsyncThunk(
    'payment/calculatePayments',
    async ({ startDate, endDate }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/payments/calculate?startDate=${startDate}&endDate=${endDate}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const generatePaymentReport = createAsyncThunk(
    'payment/generateReport',
    async ({ startDate, endDate }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/payments/report?startDate=${startDate}&endDate=${endDate}`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `payment-report-${startDate}-to-${endDate}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            return null;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getTutorPaymentHistory = createAsyncThunk(
    'payment/getTutorHistory',
    async ({ tutorId, startDate, endDate }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/payments/tutor/${tutorId}?startDate=${startDate}&endDate=${endDate}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const updateTutorRate = createAsyncThunk(
    'payment/updateTutorRate',
    async ({ tutorId, hourlyRate }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/api/payments/tutor/${tutorId}/rate`, { hourlyRate });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Calculate Payments
            .addCase(calculatePayments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(calculatePayments.fulfilled, (state, action) => {
                state.loading = false;
                state.payments = action.payload;
            })
            .addCase(calculatePayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Generate Report
            .addCase(generatePaymentReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(generatePaymentReport.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(generatePaymentReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Tutor History
            .addCase(getTutorPaymentHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTutorPaymentHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.payments = [action.payload];
            })
            .addCase(getTutorPaymentHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Tutor Rate
            .addCase(updateTutorRate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTutorRate.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateTutorRate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError } = paymentSlice.actions;
export default paymentSlice.reducer; 