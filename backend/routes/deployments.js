// backend/routes/deployments.js
const express = require('express');
const router = express.Router();
const tenantGuard = require('../middleware/tenantGuard');
const { deploymentQueue } = require('../deploymentQueue');

// Triggers background cluster provisioning processing routines pipelines mapping boundaries
router.post('/launch', tenantGuard, async (req, res) => {
    const { clusterName, provider } = req.body;

    if (!clusterName || !provider) {
        return res.status(400).json({ error: "Missing required payload tracking properties fields." });
    }

    try {
        // Push deployment setup metadata context details configuration payloads securely into Redis queue parameters
        const job = await deploymentQueue.add(`deploy-${req.tenantId}`, {
            tenantId: req.tenantId,
            clusterName,
            provider
        });

        res.status(202).json({
            message: "Deployment pipeline successfully queued into cloud infrastructure manager background routines.",
            jobId: job.id
        });
    } catch (error) {
        console.error("Queue Push Failure Error Log:", error);
        res.status(500).json({ error: "Failed to allocate background execution pipeline stack contexts." });
    }
});

module.exports = router;
