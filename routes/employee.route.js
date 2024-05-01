import express from "express";
import * as employee from '../controllers/employee.controller.js';
import * as authController from '../auth/employeeAuth.controller.js';
import { requireLoggedOut } from '../middleware/authLogout.js';

const router = express.Router();

// Route for creating a new employee
router.post("/", employee.insertEmployee);

// Route for getting all employees
router.get("/", employee.showAllEmployees);

// Route for getting a employee by ID
router.get("/:id", employee.showEmployee);

// Route for updating a employee
router.put("/:id", employee.updateEmployee);

// Route for deleting a employee
router.delete("/:id", employee.deleteEmployee);

// Route for is_active a employee
router.delete("/is_active/:id", employee.is_activeEmployee);

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

// Search employee
router.get('/employees/search', employee.searchEmployee);

export default router;
