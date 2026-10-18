// backend/models/models.js
const mongoose = require('mongoose');

// 1. Organization Account Structure
const TenantSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    plan: { type: String, enum: ['Basic', 'Enterprise'], default: 'Basic' },
    createdAt: { type: Date, default: Date.now }
});

// 2. Identity Management Structure
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'DevOps', 'Viewer'], default: 'Viewer' },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true }
});

// 3. Environment Integration Credentials
const CloudAccountSchema = new mongoose.Schema({
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    provider: { type: String, enum: ['AWS', 'Azure', 'GCP'], required: true },
    environment: { type: String, enum: ['Production', 'Staging', 'Dev'], required: true },
    status: { type: String, enum: ['Connected', 'Error'], default: 'Connected' },
    mockConfig: {
        region: { type: String, default: 'us-east-1' },
        clusterName: { type: String, default: 'main-cluster' }
    }
});

// 4. Performance Log Aggregation Store
const MetricLogSchema = new mongoose.Schema({
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'CloudAccount', required: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    timestamp: { type: Date, default: Date.now },
    metricType: { type: String, enum: ['CPU', 'Memory', 'CostPerHour'], required: true },
    value: { type: Number, required: true },
    resourceName: { type: String, required: true }
});

// Structural Compound Database Index to optimize metrics time queries per tenant
MetricLogSchema.index({ tenantId: 1, timestamp: -1 });

module.exports = {
    Tenant: mongoose.model('Tenant', TenantSchema),
    User: mongoose.model('User', UserSchema),
    CloudAccount: mongoose.model('CloudAccount', CloudAccountSchema),
    MetricLog: mongoose.model('MetricLog', MetricLogSchema)
};
