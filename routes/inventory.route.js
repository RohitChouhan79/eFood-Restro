import express from "express";
import * as inventory from '../controllers/inventory.controller.js';

const router = express.Router();

// Route for creating a new inventory
router.post("/", inventory.insertInventory);

// Route for getting all inventoryes
router.get("/", inventory.showAllInventoryes);

// Route for getting a inventory by ID
router.get("/:id", inventory.showInventory);

// Route for updating a inventory
router.put("/:id", inventory.updateInventory);

// Route for deleting a inventory
router.delete("/:id", inventory.deleteInventory);

// Search inventory
router.get('/inventoryes/search', inventory.searchInventory);

export default router;
