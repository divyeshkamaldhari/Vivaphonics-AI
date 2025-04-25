import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import paymentReducer from './features/payment/paymentSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        payment: paymentReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store; 