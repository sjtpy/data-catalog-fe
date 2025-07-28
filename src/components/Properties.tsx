import React, { useState, useEffect } from 'react';
import { apiService, Property } from '../services/api';

const Properties: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const response = await apiService.getProperties();
            setProperties(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch properties');
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
            } catch (err) {
                setError('Failed to delete property');
                console.error('Error deleting property:', err);
            }
        }
    };

    if (loading) return <div>Loading properties...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="properties">
            <h2>Properties</h2>
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