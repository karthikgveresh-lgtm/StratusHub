// backend/deploymentQueue.js
const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');
require('dotenv').config();

// Connect securely to your local running Redis caching data system instance
const redisConnection = new IORedis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null // Required by BullMQ specifications configuration guidelines
});

// 1. Instantiating the unique Deployment Task Queue line bounds configuration
const deploymentQueue = new Queue('deployment-tasks', { connection: redisConnection });

// 2. Multi-step deployment lifecycle log simulation records data payload arrays
const deploymentSteps = [
    { pct: 10, text: "📦 [SYSTEM] Initializing secure multi-cloud setup matrix blueprints..." },
    { pct: 25, text: "☁️ [AWS] Contacting us-east-1 endpoint cluster manager gateway... ⏳" },
    { pct: 45, text: "🔐 [AWS] Allocating Elastic IP addresses & establishing VPC routes... ✅" },
    { pct: 65, text: "🛡️ [AZURE] Initializing firewalls and provisioning container instances... ⏳" },
    { pct: 85, text: "🌐 [GCP] Hooking global load balancing infrastructure points... ✅" },
    { pct: 100, text: "🎉 [SYSTEM] Stack Deployment Complete! All clusters online and green." }
];

// Helper delay utility function string to space out mock log telemetry generation events
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 3. Constructing the Worker engine loop process that builds out task queues
const deploymentWorker = new Worker('deployment-tasks', async (job) => {
    const { tenantId, clusterName, provider } = job.data;
    console.log(`👷 Worker: Started processing deployment job #${job.id} for Tenant: ${tenantId}`);

    for (const step of deploymentSteps) {
        // Check if global socket.io server instance context layer exists securely
        if (global.io) {
            // Emit the event directly to the specific company's secure workspace streaming room channel
            global.io.to(tenantId).emit('deployment-log', {
                jobId: job.id,
                clusterName,
                provider,
                progress: step.pct,
                logLine: `[${new Date().toLocaleTimeString()}] ${step.text}`
            });
        }

        // Hold execution processing space for 2.5 seconds to mimic build delays beautifully
        await sleep(2500);
    }

    return { success: true };
}, { connection: redisConnection });

deploymentWorker.on('completed', (job) => {
    console.log(`✅ Worker: Job #${job.id} has successfully finished handling deployments operations parameters.`);
});

deploymentWorker.on('failed', (job, err) => {
    console.error(`❌ Worker: Job #${job.id} crashed processing deployments operations flags:`, err);
});

module.exports = { deploymentQueue };
