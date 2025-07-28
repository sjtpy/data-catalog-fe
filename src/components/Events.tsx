import React, { useState, useEffect } from 'react';
import { apiService, Event } from '../services/api';

const Events: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await apiService.getEvents();
            setEvents(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch events');
            console.error('Error fetching events:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await apiService.deleteEvent(id);
                fetchEvents(); // Refresh the list
            } catch (err) {
                setError('Failed to delete event');
                console.error('Error deleting event:', err);
            }
        }
    };

    if (loading) return <div>Loading events...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="events">
            <h2>Events</h2>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Description</th>
                            <th>Properties</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr key={event.id}>
                                <td>{event.name}</td>
                                <td>{event.type}</td>
                                <td>{event.description}</td>
                                <td>{event.propertyIds?.length || 0} properties</td>
                                <td>
                                    <button onClick={() => handleDelete(event.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {events.length === 0 && <p>No events found.</p>}
            </div>
        </div>
    );
};

export default Events;