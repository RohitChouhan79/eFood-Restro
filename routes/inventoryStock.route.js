import express from "express";
import * as inventoryStock from '../controllers/inventoryStock.controller.js';

const router = express.Router();

// Route for creating a new inventoryStock
router.post("/", inventoryStock.insertInventoryStock);

// Route for getting all inventoryStockes
router.get("/", inventoryStock.showAllInventoryStocks);

// Route for getting a inventoryStock by ID
router.get("/:id", inventoryStock.showInventoryStock);

// Route for updating a inventoryStock
router.put("/:id", inventoryStock.updateInventoryStock);

// Route for deleting a inventoryStock
router.delete("/:id", inventoryStock.deleteInventoryStock);

// Search inventoryStock
router.get('/inventoryStocks/search', inventoryStock.searchInventoryStock);

export default router;
