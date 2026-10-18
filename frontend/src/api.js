import axios from 'axios';
import { useCloudStore } from './store';

// Create a configured instance pointing to your partner's local Express server
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Adjust if your partner is using a different port
    timeout: 10000,
});

// Automatically append the Tenant ID to every request header
api.interceptors.request.use((config) => {
    // Grab the fresh ID straight from our central state engine
    const tenantId = useCloudStore.getState().currentTenant.id;

    if (tenantId) {
        config.headers['x-tenant-id'] = tenantId;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
