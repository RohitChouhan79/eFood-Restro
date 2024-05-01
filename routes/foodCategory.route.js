import express from "express";
import * as foodCategory from '../controllers/foodCategory.controller.js';

const router = express.Router();

// Route for creating a new foodCategory
router.post("/", foodCategory.insertFoodCategory);

// Route for getting all foodCategorys
router.get("/", foodCategory.showAllFoodCategorys);

// Route for getting a foodCategory by ID
router.get("/:id", foodCategory.showFoodCategory);

// Route for updating a foodCategory
router.put("/:id", foodCategory.updateFoodCategory);

// Route for deleting a foodCategory
router.delete("/:id", foodCategory.deleteFoodCategory);

// Search foodCategory
router.get('/foodCategorys/search', foodCategory.searchFoodCategory);

export default router;
