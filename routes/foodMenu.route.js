import express from "express";
import * as foodMenu from '../controllers/foodMenu.controller.js';

const router = express.Router();

// Route for creating a new foodMenu
router.post("/", foodMenu.insertFoodMenu);

// Route for getting all foodMenus
router.get("/", foodMenu.showAllFoodMenus);

// Route for getting a foodMenu by ID
router.get("/:id", foodMenu.showFoodMenu);

// Route for updating a foodMenu
router.put("/:id", foodMenu.updateFoodMenu);

// Route for deleting a foodMenu
router.delete("/:id", foodMenu.deleteFoodMenu);

// Search foodMenu
router.get('/foodMenus/search', foodMenu.searchFoodMenu);

export default router;
