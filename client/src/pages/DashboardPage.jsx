import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../features/dashboard/dashboardSlice';
import { Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { format } from 'date-fns';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const DashboardPage = () => {
    const dispatch = useDispatch();
    const { metrics, charts, upcomingSessions, loading, error } = useSelector(
        (state) => state.dashboard
    );

    useEffect(() => {
        dispatch(fetchDashboardData());
    }, [dispatch]);

    // Line chart data for sessions per week
    const lineChartData = {
        labels: charts.sessionsPerWeek.map(item => format(new Date(item.week), 'MMM d')),
        datasets: [
            {
                label: 'Sessions',
                data: charts.sessionsPerWeek.map(item => item.count),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    // Pie chart data for sessions by status
    const pieChartData = {
        labels: charts.sessionsByStatus.map(item => item.status),
        datasets: [
            {
                data: charts.sessionsByStatus.map(item => item.count),
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)'
                ]
            }
        ]
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Active Students</h3>
                    <p className="text-3xl font-bold">{metrics.activeStudents}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Upcoming Sessions</h3>
                    <p className="text-3xl font-bold">{metrics.upcomingSessions}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Total Payments Due</h3>
                    <p className="text-3xl font-bold">${metrics.totalPaymentsDue.toFixed(2)}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Sessions Per Week</h3>
                    <Line data={lineChartData} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Sessions By Status</h3>
                    <Pie data={pieChartData} />
                </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Upcoming Sessions</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tutor
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {upcomingSessions.map((session) => (
                                <tr key={session.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {format(new Date(session.date), 'MMM d, yyyy')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {format(new Date(session.startTime), 'h:mm a')} -{' '}
                                        {format(new Date(session.endTime), 'h:mm a')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{session.student}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{session.tutor}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage; 