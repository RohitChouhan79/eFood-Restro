import express from "express";
import * as deliveryPartner from '../controllers/deliveryPartner.controller.js';
import * as authController from '../auth/deliveryPartnerAuth.controller.js';
import { requireLoggedOut } from '../middleware/authLogout.js';

const router = express.Router();

// Route for creating a new deliveryPartner
router.post("/", deliveryPartner.insertDeliveryPartner);

// Route for getting all deliveryPartners
router.get("/", deliveryPartner.showAllDeliveryPartners);

// Route for getting a deliveryPartner by ID
router.get("/:id", deliveryPartner.showDeliveryPartner);

// Route for updating a deliveryPartner
router.put("/:id", deliveryPartner.updateDeliveryPartner);

// Route for deleting a deliveryPartner
router.delete("/:id", deliveryPartner.deleteDeliveryPartner);

// Route for is_active a deliveryPartner
router.delete("/is_active/:id", deliveryPartner.is_activeDeliveryPartner);

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

// Search deliveryPartner
router.get('/deliveryPartners/search', deliveryPartner.searchDeliveryPartner);

export default router;
