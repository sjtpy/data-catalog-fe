import React, { useState, useEffect } from 'react';
import { apiService, TrackingPlan } from '../services/api';

const TrackingPlans: React.FC = () => {
    const [trackingPlans, setTrackingPlans] = useState<TrackingPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTrackingPlans();
    }, []);

    const fetchTrackingPlans = async () => {
        try {
            setLoading(true);
            const response = await apiService.getTrackingPlans();
            setTrackingPlans(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch tracking plans');
            console.error('Error fetching tracking plans:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this tracking plan?')) {
            try {
                await apiService.deleteTrackingPlan(id);
                fetchTrackingPlans(); // Refresh the list
            } catch (err) {
                setError('Failed to delete tracking plan');
                console.error('Error deleting tracking plan:', err);
            }
        }
    };

    if (loading) return <div>Loading tracking plans...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="tracking-plans">
            <h2>Tracking Plans</h2>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Events</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trackingPlans.map((plan) => (
                            <tr key={plan.id}>
                                <td>{plan.name}</td>
                                <td>{plan.description}</td>
                                <td>{plan.eventIds?.length || 0} events</td>
                                <td>
                                    <button onClick={() => handleDelete(plan.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {trackingPlans.length === 0 && <p>No tracking plans found.</p>}
            </div>
        </div>
    );
};

export default TrackingPlans;