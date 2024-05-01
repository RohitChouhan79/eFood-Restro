import express from "express";
import * as purchaseItem from '../controllers/purchaseItem.controller.js';

const router = express.Router();

// Route for creating a new purchaseItem
router.post("/", purchaseItem.insertPurchaseItem);

// Route for getting all purchaseItems
router.get("/", purchaseItem.showAllPurchaseItems);

// Route for getting a purchaseItem by ID
router.get("/:id", purchaseItem.showPurchaseItem);

// Route for updating a purchaseItem
router.put("/:id", purchaseItem.updatePurchaseItem);

// Route for deleting a purchaseItem
router.delete("/:id", purchaseItem.deletePurchaseItem);

export default router;
