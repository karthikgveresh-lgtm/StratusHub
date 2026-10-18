// backend/routes/metrics.js
const express = require('express');
const router = express.Router();
const tenantGuard = require('../middleware/tenantGuard');
const { MetricLog } = require('../models/models');

// Mount validation filter criteria safely onto target router pathway configurations
router.get('/', tenantGuard, async (req, res) => {
    try {
        // Explicitly target data records matching req.tenantId constraints strictly
        const isolatedLogs = await MetricLog.find({ tenantId: req.tenantId })
            .sort({ timestamp: -1 })
            .limit(50);
        res.status(200).json(isolatedLogs);
    } catch (error) {
        res.status(500).json({ error: "Failed to query system resource metrics history." });
    }
});

module.exports = router;
