// backend/seed.js
const mongoose = require('mongoose');
const { Tenant, CloudAccount } = require('./models/models');
require('dotenv').config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('🌱 Connected to MongoDB for seeding...');

        // Clean up previous runs
        await Tenant.deleteMany({});
        await CloudAccount.deleteMany({});

        // 1. Create a Demo Organization
        const demoTenant = await Tenant.create({
            name: 'Acme Corp Labs',
            plan: 'Enterprise'
        });
        console.log(`🏢 Created Mock Tenant ID: ${demoTenant._id}`);

        // 2. Create Infrastructure Integrations for this organization
        const clouds = [
            { provider: 'AWS', environment: 'Production', region: 'us-east-1' },
            { provider: 'Azure', environment: 'Staging', region: 'eastus' },
            { provider: 'GCP', environment: 'Dev', region: 'europe-west1' }
        ];

        for (const cloud of clouds) {
            await CloudAccount.create({
                tenantId: demoTenant._id,
                provider: cloud.provider,
                environment: cloud.environment,
                mockConfig: { region: cloud.region, clusterName: `${cloud.provider.toLowerCase()}-cluster-01` }
            });
        }

        console.log('✅ Database seeded with 3 Cloud Accounts successfully.');
        console.log(`\n👉 CRITICAL COPY STEP FOR FRONTEND TESTING:`);
        console.log(`Use this exact Tenant ID string inside your API testing client or frontend headers ('x-tenant-id'): \n\x1b[36m%s\x1b[0m`, demoTenant._id);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();
