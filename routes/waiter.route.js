import express from "express";
import * as waiter from '../controllers/waiter.controller.js';
import * as authController from '../auth/waiterAuth.controller.js';
import { requireLoggedOut } from '../middleware/authLogout.js';

const router = express.Router();

// Route for creating a new waiter
router.post("/", waiter.insertWaiter);

// Route for getting all waiters
router.get("/", waiter.showAllWaiters);

// Route for getting a waiter by ID
router.get("/:id", waiter.showWaiter);

// Route for updating a waiter
router.put("/:id", waiter.updateWaiter);

// Route for deleting a waiter
router.delete("/:id", waiter.deleteWaiter);

// Route for is_active a waiter
router.delete("/is_active/:id", waiter.is_activeWaiter);

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

// Search waiter
router.get('/waiters/search', waiter.searchWaiter);

export default router;
