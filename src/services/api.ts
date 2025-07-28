import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Event {
    id: string;
    name: string;
    type: string;
    description: string;
    propertyIds: string[];
}

export interface Property {
    id: string;
    name: string;
    type: string;
    description: string;
}

export interface TrackingPlan {
    id: string;
    name: string;
    description: string;
    eventIds: string[];
}

export const apiService = {
    // Events
    getEvents: () => api.get<{ success: boolean; data: Event[] }>('/events'),
    getEvent: (id: string) => api.get<{ success: boolean; data: Event }>(`/events/${id}`),
    createEvent: (data: { name: string; type: string; description: string; properties?: { name: string; type: string; description: string }[] }) =>
        api.post<{ success: boolean; data: Event }>('/events', data),
    updateEvent: (id: string, data: Partial<Event>) => api.put<{ success: boolean; data: Event }>(`/events/${id}`, data),
    deleteEvent: (id: string) => api.delete<{ success: boolean; message: string }>(`/events/${id}`),

    // Properties
    getProperties: () => api.get<{ success: boolean; data: Property[] }>('/properties'),
    getProperty: (id: string) => api.get<{ success: boolean; data: Property }>(`/properties/${id}`),
    createProperty: (data: Partial<Property>) => api.post<{ success: boolean; data: Property }>('/properties', data),
    updateProperty: (id: string, data: Partial<Property>) => api.put<{ success: boolean; data: Property }>(`/properties/${id}`, data),
    deleteProperty: (id: string) => api.delete<{ success: boolean; message: string }>(`/properties/${id}`),

    // Tracking Plans
    getTrackingPlans: () => api.get<{ success: boolean; data: TrackingPlan[] }>('/plans'),
    getTrackingPlan: (id: string) => api.get<{ success: boolean; data: TrackingPlan }>(`/plans/${id}`),
    createTrackingPlan: (data: any) => api.post<{ success: boolean; data: TrackingPlan }>('/plans', data),
    updateTrackingPlan: (id: string, data: any) => api.put<{ success: boolean; data: TrackingPlan }>(`/plans/${id}`, data),
    deleteTrackingPlan: (id: string) => api.delete<{ success: boolean; message: string }>(`/plans/${id}`),
};

export default api;
