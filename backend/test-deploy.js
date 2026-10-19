// backend/test-deploy.js
const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();

const { Tenant } = require('./models/models');

async function executeAutoDiscoveredTest() {
    try {
        // 1. Connect to MongoDB to find a valid live tenant ID
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aethernexus');

        const activeOrg = await Tenant.findOne();
        if (!activeOrg) {
            console.log("❌ Error: No tenant records found. Run 'node seed.js' first.");
            process.exit(1);
        }

        const liveTenantId = activeOrg._id.toString();
        console.log(`🔍 Auto-Discovered Valid Tenant ID: ${liveTenantId}`);

        // Disconnect from database before executing the HTTP request
        await mongoose.disconnect();

        // 2. Prepare request data payload
        const payloadData = JSON.stringify({
            clusterName: "production-api-node",
            provider: "AWS"
        });

        const requestOptions = {
            hostname: '127.0.0.1',
            port: 5000,
            path: '/api/deployments/launch',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payloadData),
                'x-tenant-id': liveTenantId // Dynamically injects the correct live ID
            }
        };

        // 3. Dispatch the request to the server
        const req = http.request(requestOptions, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => { responseBody += chunk; });
            res.on('end', () => {
                console.log(`\n🎉 Server Response Status Code: ${res.statusCode}`);
                console.log(`📦 Response Body Content: ${responseBody}\n`);
            });
        });

        req.on('error', (error) => {
            console.error(`❌ Connection Error:`, error.message);
        });

        req.write(payloadData);
        req.end();

    } catch (err) {
        console.error("Script Processing Failure:", err);
    }
}

executeAutoDiscoveredTest();
