import React, { useState, useEffect } from 'react';
import { apiService, TrackingPlan, Event } from '../services/api';

const TrackingPlans: React.FC = () => {
    const [trackingPlans, setTrackingPlans] = useState<TrackingPlan[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        events: [] as string[]
    });

    useEffect(() => {
        fetchTrackingPlans();
        fetchEvents();
    }, []);

    const fetchTrackingPlans = async () => {
        try {
            setLoading(true);
            const response = await apiService.getTrackingPlans();
            setTrackingPlans(response.data.data);
            setError(null);
        } catch (err: any) {
            const statusCode = err.response?.status;
            const backendMessage = err.response?.data?.message || err.response?.data?.error;
            const axiosMessage = err.message;

            let errorMessage = '';
            if (backendMessage) {
                errorMessage = `Error ${statusCode}: ${backendMessage}`;
            } else if (axiosMessage) {
                errorMessage = `Error ${statusCode}: ${axiosMessage}`;
            } else {
                errorMessage = `Error ${statusCode}: Failed to fetch tracking plans`;
            }

            setError(errorMessage);
            console.error('Error fetching tracking plans:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchEvents = async () => {
        try {
            const response = await apiService.getEvents();
            setEvents(response.data.data);
        } catch (err: any) {
            console.error('Error fetching events:', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this tracking plan?')) {
            try {
                await apiService.deleteTrackingPlan(id);
                fetchTrackingPlans(); // Refresh the list
            } catch (err: any) {
                const statusCode = err.response?.status;
                const backendMessage = err.response?.data?.message || err.response?.data?.error;
                const axiosMessage = err.message;

                let errorMessage = '';
                if (backendMessage) {
                    errorMessage = `Error ${statusCode}: ${backendMessage}`;
                } else if (axiosMessage) {
                    errorMessage = `Error ${statusCode}: ${axiosMessage}`;
                } else {
                    errorMessage = `Error ${statusCode}: Failed to delete tracking plan`;
                }

                setError(errorMessage);
                console.error('Error deleting tracking plan:', err);
            }
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Convert selected event IDs to event objects for the API
            const selectedEvents = formData.events.map(eventId => {
                const event = events.find(e => e.id === eventId);
                return {
                    name: event?.name || '',
                    type: event?.type || '',
                    description: event?.description || ''
                };
            });

            await apiService.createTrackingPlan({
                name: formData.name,
                description: formData.description,
                events: selectedEvents
            });

            setFormData({ name: '', description: '', events: [] });
            setShowCreateForm(false);
            fetchTrackingPlans(); // Refresh the list
        } catch (err: any) {
            const statusCode = err.response?.status;
            const backendMessage = err.response?.data?.message || err.response?.data?.error;
            const axiosMessage = err.message;

            let errorMessage = '';
            if (backendMessage) {
                errorMessage = `Error ${statusCode}: ${backendMessage}`;
            } else if (axiosMessage) {
                errorMessage = `Error ${statusCode}: ${axiosMessage}`;
            } else {
                errorMessage = `Error ${statusCode}: Failed to create tracking plan`;
            }

            setError(errorMessage);
            console.error('Error creating tracking plan:', err);
        }
    };

    const handleEventChange = (eventId: string, checked: boolean) => {
        if (checked) {
            setFormData(prev => ({
                ...prev,
                events: [...prev.events, eventId]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                events: prev.events.filter(id => id !== eventId)
            }));
        }
    };

    if (loading) return <div>Loading tracking plans...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="tracking-plans">
            <div className="header">
                <h2>Tracking Plans</h2>
                <button
                    className="create-btn"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    {showCreateForm ? 'Cancel' : 'Create Tracking Plan'}
                </button>
            </div>

            {showCreateForm && (
                <form onSubmit={handleCreate} className="create-form">
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Events:</label>
                        <div className="event-checkboxes">
                            {events.map((event) => (
                                <label key={event.id} className="event-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={formData.events.includes(event.id)}
                                        onChange={(e) => handleEventChange(event.id, e.target.checked)}
                                    />
                                    <span className="event-name">{event.name}</span>
                                    <span className="event-type">({event.type})</span>
                                </label>
                            ))}
                            {events.length === 0 && (
                                <p className="no-events">No events available. Create some events first.</p>
                            )}
                        </div>
                    </div>
                    <button type="submit">Create Tracking Plan</button>
                </form>
            )}

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