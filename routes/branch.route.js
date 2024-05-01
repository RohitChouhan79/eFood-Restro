import express from "express";
import * as branch from '../controllers/branch.controller.js';
import * as authController from '../auth/branchAuth.controller.js';
import { requireLoggedOut } from '../middleware/authLogout.js';

const router = express.Router();

// Route for creating a new branch
router.post("/", branch.insertBranch);

// Route for getting all branches
router.get("/", branch.showAllBranches);

// Route for getting a branch by ID
router.get("/:id", branch.showBranch);

// Route for updating a branch
router.put("/:id", branch.updateBranch);

// Route for deleting a branch
router.delete("/:id", branch.deleteBranch);

// Route for is_active a branch
router.delete("/is_active/:id", branch.is_activeBranch);

// Login company
router.post('/login', authController.login);

// Logout company
router.post('/logout', authController.logout);

// Forget Password
router.post('/forgot-password',requireLoggedOut, authController.forgotPassword);

// Reset Password
router.post('/reset-password', authController.resetPassword);

// Change Password
router.post('/change-password/:id', authController.changePassword);

// Search branch
router.get('/branches/search', branch.searchBranch);

// Route for updating requestStatus of Deliveryman
router.put("/:branchId/deliveryman/:deliveryPartnerId", branch.updateDeliverymanRequestStatus);

export default router;
