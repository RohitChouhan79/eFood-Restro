import express from "express";
import * as stockAdjustment from '../controllers/stockAdjustment.controller.js';

const router = express.Router();

// Route for creating a new stockAdjustment
router.post("/", stockAdjustment.insertStockAdjustment);

// Route for getting all stockAdjustments
router.get("/", stockAdjustment.showAllStockAdjustments);

// Route for getting a stockAdjustment by ID
router.get("/:id", stockAdjustment.showStockAdjustment);

// Route for updating a stockAdjustment
router.put("/:id", stockAdjustment.updateStockAdjustment);

// Route for deleting a stockAdjustment
router.delete("/:id", stockAdjustment.deleteStockAdjustment);

export default router;
