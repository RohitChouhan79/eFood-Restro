import express from "express";
import * as billing from '../controllers/billing.controller.js';

const router = express.Router();

// Route for creating a new billing
router.post("/", billing.insertBilling);

// Route for getting all billings
router.get("/", billing.showAllBillings);

// Route for getting a billing by ID
router.get("/:id", billing.showBilling);

// Route for updating a billing
router.put("/:id", billing.updateBilling);

// Route for deleting a billing
router.delete("/:id", billing.deleteBilling);

export default router;
