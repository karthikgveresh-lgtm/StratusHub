// backend/middleware/tenantGuard.js
const mongoose = require('mongoose');

const tenantGuard = (req, res, next) => {
    // Extract custom organization context header tracking parameter
    const tenantId = req.headers['x-tenant-id'];

    if (!tenantId) {
        return res.status(400).json({
            error: "Access Denied: Missing unique 'x-tenant-id' context context header parameter value."
        });
    }

    // Validate formatting standard constraints for standard hex values
    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
        return res.status(400).json({
            error: "Access Denied: The target resource header parameter format string value is invalid."
        });
    }

    // Assign verified boundary value context reference parameter back onto server pipeline request object stack
    req.tenantId = tenantId;
    next();
};

module.exports = tenantGuard;
