// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // Required to anchor WebSockets
const { Server } = require('socket.io');
require('dotenv').config();

const { startMockEngine } = require('./mockEngine');

const app = express();
const PORT = process.env.PORT || 5000;

// Create standard HTTP server wrapping our Express instance
const server = http.createServer(app);


// 1. UPGRADE THIS MIDDELWARE LAYER: Configure strict cross-origin allowances
app.use(cors({
    origin: "http://localhost:5173", // Grants direct access rights to your partner's local Vite server
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-tenant-id"] // Allows your custom multi-tenant header parameters
}));

// Initialize Socket.io Server instance configuration details
const io = new Server(server, {
    cors: {
        origin: "*", // Allows any local development frontend workspace to connect securely
        methods: ["GET", "POST"]
    }
});

// Expose the io instance globally to make it accessible in our background queues
global.io = io;

app.use(cors());
app.use(express.json());

// Database Connection Lifecycle
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Connected securely to MongoDB database.');
        startMockEngine(10000);
    })
    .catch((err) => console.error('❌ Database connection failure:', err));

// Diagnostic logs when a user connects their web client
io.on('connection', (socket) => {
    console.log(`🔌 Client connected to live telemetry stream: ${socket.id}`);

    // Allow clients to join a room specific to their organization workspace 
    socket.on('join-tenant-room', (tenantId) => {
        socket.join(tenantId);
        console.log(`👤 Client joined private tenant channel room: ${tenantId}`);
    });

    socket.on('disconnect', () => {
        console.log(`❌ Client disconnected from socket stream: ${socket.id}`);
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: "active", message: "System operational." });
});

const metricsRouter = require('./routes/metrics');
const deploymentsRouter = require('./routes/deployments'); // Phase 3 trigger route
app.use('/api/metrics', metricsRouter);
app.use('/api/deployments', deploymentsRouter);

// CRITICAL FIX: Change from app.listen to server.listen to support sockets
server.listen(PORT, () => {
    console.log(`🚀 Multi-Cloud Hub API Gateway active on network port: ${PORT}`);
});
