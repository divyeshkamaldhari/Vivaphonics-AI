import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Box, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    Button, 
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { calculatePayments, generatePaymentReport, getTutorPaymentHistory, updateTutorRate } from '../features/payment/paymentSlice';

const PaymentDashboard = () => {
    const dispatch = useDispatch();
    const { payments, loading, error } = useSelector((state) => state.payment);
    const { user } = useSelector((state) => state.auth);

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedTutor, setSelectedTutor] = useState(null);
    const [tutorHistory, setTutorHistory] = useState(null);
    const [rateDialogOpen, setRateDialogOpen] = useState(false);
    const [newRate, setNewRate] = useState('');

    useEffect(() => {
        // Load initial payment data
        const fetchPayments = async () => {
            const formattedStartDate = format(startDate, 'yyyy-MM-dd');
            const formattedEndDate = format(endDate, 'yyyy-MM-dd');
            
            if (user.role === 'Admin') {
                await dispatch(calculatePayments({ startDate: formattedStartDate, endDate: formattedEndDate }));
            } else {
                await dispatch(getTutorPaymentHistory({ 
                    tutorId: user._id, 
                    startDate: formattedStartDate, 
                    endDate: formattedEndDate 
                }));
            }
        };

        fetchPayments();
    }, [dispatch, startDate, endDate, user]);

    const handleDateChange = async () => {
        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(endDate, 'yyyy-MM-dd');

        if (user.role === 'Admin') {
            await dispatch(calculatePayments({ startDate: formattedStartDate, endDate: formattedEndDate }));
        } else {
            await dispatch(getTutorPaymentHistory({ 
                tutorId: user._id, 
                startDate: formattedStartDate, 
                endDate: formattedEndDate 
            }));
        }
    };

    const handleGenerateReport = async () => {
        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(endDate, 'yyyy-MM-dd');
        
        await dispatch(generatePaymentReport({ startDate: formattedStartDate, endDate: formattedEndDate }));
    };

    const handleViewTutorHistory = async (tutor) => {
        setSelectedTutor(tutor);
        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(endDate, 'yyyy-MM-dd');
        
        const result = await dispatch(getTutorPaymentHistory({ 
            tutorId: tutor.tutorId, 
            startDate: formattedStartDate, 
            endDate: formattedEndDate 
        }));
        
        setTutorHistory(result.payload);
    };

    const handleUpdateRate = async () => {
        if (selectedTutor && newRate) {
            await dispatch(updateTutorRate({ 
                tutorId: selectedTutor.tutorId, 
                hourlyRate: parseFloat(newRate) 
            }));
            setRateDialogOpen(false);
            setNewRate('');
            handleDateChange(); // Refresh data
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Payment Dashboard
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Button 
                        variant="contained" 
                        onClick={handleDateChange}
                        sx={{ mt: 1 }}
                    >
                        Update
                    </Button>
                </Grid>
            </Grid>

            {user.role === 'Admin' ? (
                <>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleGenerateReport}
                        sx={{ mb: 3 }}
                    >
                        Generate Report
                    </Button>

                    <Grid container spacing={3}>
                        {payments?.map((payment) => (
                            <Grid item xs={12} md={6} lg={4} key={payment.tutorId}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6">{payment.tutor}</Typography>
                                        <Typography>Total Hours: {payment.totalHours.toFixed(2)}</Typography>
                                        <Typography>Total Payment: ${payment.totalPayment.toFixed(2)}</Typography>
                                        <Button 
                                            variant="outlined" 
                                            onClick={() => handleViewTutorHistory(payment)}
                                            sx={{ mt: 2 }}
                                        >
                                            View History
                                        </Button>
                                        <Button 
                                            variant="outlined" 
                                            onClick={() => {
                                                setSelectedTutor(payment);
                                                setRateDialogOpen(true);
                                            }}
                                            sx={{ mt: 2, ml: 2 }}
                                        >
                                            Update Rate
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </>
            ) : (
                <Card>
                    <CardContent>
                        <Typography variant="h6">Your Payment History</Typography>
                        {tutorHistory && (
                            <>
                                <Typography>Total Hours: {tutorHistory.totalHours}</Typography>
                                <Typography>Total Payment: ${tutorHistory.totalPayment}</Typography>
                                <TableContainer component={Paper} sx={{ mt: 2 }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Student</TableCell>
                                                <TableCell>Duration</TableCell>
                                                <TableCell>Rate</TableCell>
                                                <TableCell>Payment</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {tutorHistory.sessions.map((session, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{format(new Date(session.date), 'MM/dd/yyyy')}</TableCell>
                                                    <TableCell>{session.student}</TableCell>
                                                    <TableCell>{session.duration} minutes</TableCell>
                                                    <TableCell>${session.hourlyRate}/hour</TableCell>
                                                    <TableCell>${session.payment.toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}

            <Dialog open={rateDialogOpen} onClose={() => setRateDialogOpen(false)}>
                <DialogTitle>Update Tutor Rate</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="New Hourly Rate"
                        type="number"
                        fullWidth
                        value={newRate}
                        onChange={(e) => setNewRate(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRateDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdateRate}>Update</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PaymentDashboard; 