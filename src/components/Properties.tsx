import React, { useState, useEffect } from 'react';
import { apiService, Property } from '../services/api';

const Properties: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        description: ''
    });

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const response = await apiService.getProperties();
            setProperties(response.data.data);
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
                errorMessage = `Error ${statusCode}: Failed to fetch properties`;
            }

            setError(errorMessage);
            console.error('Error fetching properties:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            try {
                await apiService.deleteProperty(id);
                fetchProperties(); // Refresh the list
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
                    errorMessage = `Error ${statusCode}: Failed to delete property`;
                }

                setError(errorMessage);
                console.error('Error deleting property:', err);
            }
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiService.createProperty(formData);
            setFormData({ name: '', type: '', description: '' });
            setShowCreateForm(false);
            fetchProperties(); // Refresh the list
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
                errorMessage = `Error ${statusCode}: Failed to create property`;
            }

            setError(errorMessage);
            console.error('Error creating property:', err);
        }
    };

    if (loading) return <div>Loading properties...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="properties">
            <div className="header">
                <h2>Properties</h2>
                <button
                    className="create-btn"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    {showCreateForm ? 'Cancel' : 'Create Property'}
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
                    <button type="submit">Create Property</button>
                </form>
            )}

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.map((property) => (
                            <tr key={property.id}>
                                <td>{property.name}</td>
                                <td>{property.type}</td>
                                <td>{property.description}</td>
                                <td>
                                    <button onClick={() => handleDelete(property.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {properties.length === 0 && <p>No properties found.</p>}
            </div>
        </div>
    );
};

export default Properties;