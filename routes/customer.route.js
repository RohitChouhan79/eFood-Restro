import express from "express";
import * as customer from '../controllers/customer.controller.js';
import * as authController from '../auth/customerAuth.controller.js';
import { requireLoggedOut } from '../middleware/authLogout.js';

const router = express.Router();

// Route for creating a new customer
router.post("/", customer.insertCustomer);

// Route for getting all customers
router.get("/", customer.showAllCustomers);

// Route for getting a customer by ID
router.get("/:id", customer.showCustomer);

// Route for updating a customer
router.put("/:id", customer.updateCustomer);

// Route for deleting a customer
router.delete("/:id", customer.deleteCustomer);

// Route for is_active a customer
router.delete("/:id", customer.is_activeCustomer);

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

// Search customer
router.get('/customers/search', customer.searchCustomer);

// Route to get order count for a particular customer
router.get("/:id/orderCount", customer.getOrderCountForCustomer);

// Define the route for getting final total for a customer
router.get('/:id/finalTotal', customer.getFinalTotalForCustomer);

export default router;
