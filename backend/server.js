// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Application Middleware
app.use(cors());
app.use(express.json()); // Essential for handling incoming JSON request bodies

// Database Connection Lifecycle
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected securely to MongoDB database.'))
    .catch((err) => console.error('❌ Database connection failure:', err));

// Routes
const metricsRouter = require('./routes/metrics');
app.use('/api/metrics', metricsRouter);

// Core Base Diagnostics Route
app.get('/health', (req, res) => {
    res.status(200).json({ status: "active", message: "System operational." });
});

app.listen(PORT, () => {
    console.log(`🚀 API Gateway active on network port: ${PORT}`);
});
