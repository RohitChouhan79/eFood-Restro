import express from "express";
import * as ingredientCategory from '../controllers/ingredientCategory.controller.js';

const router = express.Router();

// Route for creating a new ingredientCategory
router.post("/", ingredientCategory.insertIngredientCategory);

// Route for getting all ingredientCategorys
router.get("/", ingredientCategory.showAllIngredientCategorys);

// Route for getting a ingredientCategory by ID
router.get("/:id", ingredientCategory.showIngredientCategory);

// Route for updating a ingredientCategory
router.put("/:id", ingredientCategory.updateIngredientCategory);

// Route for deleting a ingredientCategory
router.delete("/:id", ingredientCategory.deleteIngredientCategory);

// Search ingredientCategory
router.get('/ingredientCategorys/search', ingredientCategory.searchIngredientCategory);


export default router;
