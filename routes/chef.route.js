import express from "express";
import * as chef from '../controllers/chef.controller.js';
import * as authController from '../auth/chefAuth.controller.js';
import { requireLoggedOut } from '../middleware/authLogout.js';

const router = express.Router();

// Route for creating a new chef
router.post("/", chef.insertChef);

// Route for getting all chefs
router.get("/", chef.showAllChefs);

// Route for getting a chef by ID
router.get("/:id", chef.showChef);

// Route for updating a chef
router.put("/:id", chef.updateChef);

// Route for deleting a chef
router.delete("/:id", chef.deleteChef);

// Route for is_active a chef
router.delete("/is_active/:id", chef.is_activeChef);

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

// Search chef
router.get('/chefs/search', chef.searchChef);

export default router;
