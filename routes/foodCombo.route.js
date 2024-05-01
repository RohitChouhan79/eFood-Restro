import express from "express";
import * as foodCombo from '../controllers/foodCombo.controller.js';

const router = express.Router();

// Route for creating a new foodCombo
router.post("/", foodCombo.insertFoodCombo);

// Route for getting all foodCombos
router.get("/", foodCombo.showAllFoodCombos);

// Route for getting a foodCombo by ID
router.get("/:id", foodCombo.showFoodCombo);

// Route for updating a foodCombo
router.put("/:id", foodCombo.updateFoodCombo);

// Route for deleting a foodCombo
router.delete("/:id", foodCombo.deleteFoodCombo);

// Search foodCombo
router.get('/foodCombos/search', foodCombo.searchFoodCombo);

export default router;
