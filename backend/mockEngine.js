// backend/mockEngine.js
const { CloudAccount, MetricLog } = require('./models/models');

/**
 * Generates a realistic fluctuating metric value based on the type
 */
const generateMetricValue = (type) => {
    switch (type) {
        case 'CPU':
            // Random percentage between 15% and 95%
            return Math.floor(Math.random() * (95 - 15 + 1)) + 15;
        case 'Memory':
            // Random percentage between 30% and 85%
            return Math.floor(Math.random() * (85 - 30 + 1)) + 30;
        case 'CostPerHour':
            // Fluctuate cost slightly around standard baselines (e.g., \$0.24 - \$4.50)
            return parseFloat((Math.random() * (4.50 - 0.24) + 0.24).toFixed(2));
        default:
            return 0;
    }
};

/**
 * Core loop that finds all registered cloud accounts and seeds metrics for them
 */
const startMockEngine = (intervalMs = 10000) => {
    console.log(`🤖 Mock Engine initialized. Generating telemetry data every ${intervalMs / 1000} seconds...`);

    setInterval(async () => {
        try {
            // 1. Fetch all cloud account integrations across all tenants
            const accounts = await CloudAccount.find();

            if (accounts.length === 0) {
                console.log('ℹ️ Mock Engine: No active cloud accounts found to generate metrics for.');
                return;
            }

            const metricTypes = ['CPU', 'Memory', 'CostPerHour'];
            const newLogs = [];

            // 2. Loop through every single account to generate time-series metrics
            for (const account of accounts) {
                for (const type of metricTypes) {
                    newLogs.push({
                        accountId: account._id,
                        tenantId: account.tenantId,
                        metricType: type,
                        value: generateMetricValue(type),
                        resourceName: `${account.environment.toLowerCase()}-${account.provider.toLowerCase()}-core-node`,
                        timestamp: new Date()
                    });
                }
            }

            // 3. Bulk insert logs efficiently into MongoDB
            if (newLogs.length > 0) {
                await MetricLog.insertMany(newLogs);
                console.log(`📈 Mock Engine: Successfully injected ${newLogs.length} telemetry metric entries into database.`);
            }

        } catch (error) {
            console.error('❌ Mock Engine Runtime Failure:', error);
        }
    }, intervalMs);
};

module.exports = { startMockEngine };
