import { io } from 'socket.io-client';
import { useCloudStore } from './store';

const BACKEND_URL = 'http://localhost:5000'; // Make sure this matches your partner's port

export const connectSocket = () => {
    // Grab the specific tenant ID from your state engine
    const tenantId = useCloudStore.getState().currentTenant.id;

    // Initialize connection with handshake configuration
    const socket = io(BACKEND_URL, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        auth: {
            tenantId: tenantId // Sends authentication context instantly on connection
        }
    });

    // Global socket connectivity log listeners
    socket.on('connect', () => {
        useCloudStore.getState().addLog(`[CONNECTED]: Established encrypted websocket link pipeline. (ID: ${socket.id})`);
    });

    socket.on('disconnect', () => {
        useCloudStore.getState().addLog('[DISCONNECTED]: Real-time data pipeline broken. Reconnecting...');
    });

    // 1. Listen for live metric numerical updates
    socket.on('metrics-update', (updatedAccounts) => {
        // updatedAccounts format example: [{ id: "1", spend: 1265 }, { id: "2", spend: 470 }]
        updatedAccounts.forEach(account => {
            useCloudStore.getState().updateSpend(account.id, account.spend);
        });
    });

    // 2. Listen for text-based server event streams
    socket.on('orchestration-log', (logMessage) => {
        useCloudStore.getState().addLog(logMessage);
    });

    return socket;
};
