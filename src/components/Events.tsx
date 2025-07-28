import React, { useState, useEffect } from 'react';
import { apiService, Event, Property } from '../services/api';

const Events: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        description: '',
        properties: [] as string[]
    });

    useEffect(() => {
        fetchEvents();
        fetchProperties();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await apiService.getEvents();
            setEvents(response.data.data);
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
                errorMessage = `Error ${statusCode}: Failed to fetch events`;
            }

            setError(errorMessage);
            console.error('Error fetching events:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProperties = async () => {
        try {
            const response = await apiService.getProperties();
            setProperties(response.data.data);
        } catch (err: any) {
            console.error('Error fetching properties:', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await apiService.deleteEvent(id);
                fetchEvents(); // Refresh the list
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
                    errorMessage = `Error ${statusCode}: Failed to delete event`;
                }

                setError(errorMessage);
                console.error('Error deleting event:', err);
            }
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Convert selected property IDs to property objects for the API
            const selectedProperties = formData.properties.map(propertyId => {
                const property = properties.find(p => p.id === propertyId);
                return {
                    name: property?.name || '',
                    type: property?.type || '',
                    description: property?.description || ''
                };
            });

            await apiService.createEvent({
                name: formData.name,
                type: formData.type,
                description: formData.description,
                properties: selectedProperties
            });

            setFormData({ name: '', type: '', description: '', properties: [] });
            setShowCreateForm(false);
            fetchEvents(); // Refresh the list
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
                errorMessage = `Error ${statusCode}: Failed to create event`;
            }

            setError(errorMessage);
            console.error('Error creating event:', err);
        }
    };

    const handlePropertyChange = (propertyId: string, checked: boolean) => {
        if (checked) {
            setFormData(prev => ({
                ...prev,
                properties: [...prev.properties, propertyId]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                properties: prev.properties.filter(id => id !== propertyId)
            }));
        }
    };

    if (loading) return <div>Loading events...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="events">
            <div className="header">
                <h2>Events</h2>
                <button
                    className="create-btn"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    {showCreateForm ? 'Cancel' : 'Create Event'}
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
                        <label>Type:</label>
                        <input
                            type="text"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
                        <label>Properties:</label>
                        <div className="property-checkboxes">
                            {properties.map((property) => (
                                <label key={property.id} className="property-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={formData.properties.includes(property.id)}
                                        onChange={(e) => handlePropertyChange(property.id, e.target.checked)}
                                    />
                                    <span className="property-name">{property.name}</span>
                                    <span className="property-type">({property.type})</span>
                                </label>
                            ))}
                            {properties.length === 0 && (
                                <p className="no-properties">No properties available. Create some properties first.</p>
                            )}
                        </div>
                    </div>
                    <button type="submit">Create Event</button>
                </form>
            )}

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