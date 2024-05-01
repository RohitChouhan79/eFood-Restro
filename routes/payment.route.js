import express from "express";
import * as payment from '../controllers/payment.controller.js';

const router = express.Router();

// Route for creating a new payment
router.post("/", payment.insertPayment);

// Route for getting all paymentes
router.get("/", payment.showAllPaymentes);

// Route for getting a payment by ID
router.get("/:id", payment.showPayment);

// Route for updating a payment
router.put("/:id", payment.updatePayment);

// Route for deleting a payment
router.delete("/:id", payment.deletePayment);

export default router;
