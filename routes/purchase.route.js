import express from "express";
import * as purchase from '../controllers/purchase.controller.js';

const router = express.Router();

// Route for creating a new purchase
router.post("/", purchase.insertPurchase);

// Route for getting all purchasees
router.get("/", purchase.showAllPurchasees);

// Route for getting a purchase by ID
router.get("/:id", purchase.showPurchase);

// Route for updating a purchase
router.put("/:id", purchase.updatePurchase);

// Route for deleting a purchase
router.delete("/:id", purchase.deletePurchase);

export default router;
