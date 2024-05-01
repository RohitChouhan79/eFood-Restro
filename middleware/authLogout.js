export function requireLoggedOut(req, res, next) {
    // Check if employee is logged in (you might need to adjust the condition based on your authentication implementation)
    if (req.cookies.companyToken) {
        // Employee is logged in, send an error response indicating that they need to log out first
        return res.status(403).json({ error: "You are already logged in. Please log out to access this functionality." });
    }
    if (req.cookies.branchToken) {
        // Employee is logged in, send an error response indicating that they need to log out first
        return res.status(403).json({ error: "You are already logged in. Please log out to access this functionality." });
    }
    if (req.cookies.employeeToken) {
        // Employee is logged in, send an error response indicating that they need to log out first
        return res.status(403).json({ error: "You are already logged in. Please log out to access this functionality." });
    }
    if (req.cookies.chefToken) {
        // Employee is logged in, send an error response indicating that they need to log out first
        return res.status(403).json({ error: "You are already logged in. Please log out to access this functionality." });
    }
    if (req.cookies.waiterToken) {
        // Employee is logged in, send an error response indicating that they need to log out first
        return res.status(403).json({ error: "You are already logged in. Please log out to access this functionality." });
    }
    if (req.cookies.deliveryPartnerToken) {
        // Employee is logged in, send an error response indicating that they need to log out first
        return res.status(403).json({ error: "You are already logged in. Please log out to access this functionality." });
    }
    if (req.cookies.customerToken) {
        // Employee is logged in, send an error response indicating that they need to log out first
        return res.status(403).json({ error: "You are already logged in. Please log out to access this functionality." });
    }
    // Employee is not logged in, proceed to the next middleware/route handler
    next();
}
