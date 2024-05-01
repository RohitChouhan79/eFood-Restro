import express from "express";
import * as company from '../controllers/company.controller.js';
import * as authController from '../auth/companyAuth.controller.js';
import { requireLoggedOut } from '../middleware/authLogout.js';

const router = express.Router();

// Route for creating a new company
router.post("/", company.companyInsert);

// Route for getting all companys
router.get("/", company.showAllCompanys);

// Route for getting a company by ID
router.get("/:id", company.showCompany);

// Route for updating a company
router.put("/:id", company.updateCompany);

// Route for deleting a company
router.delete("/:id", company.deleteCompany);

// Route for is_active a company
router.delete("/is_active/:id", company.is_activeCompany);

// Login company
router.post('/login', authController.login);

// Logout company
router.post('/logout', authController.logout);

// Forget Password
router.post('/forgot-password',requireLoggedOut, authController.forgotPassword);

// Reset Password
router.post('/reset-password', authController.resetPassword);

// Change Password
router.post('/change-password', authController.changePassword);

// Search company
router.get('/companys/search', company.searchCompany);

export default router;
