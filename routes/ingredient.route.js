import express from "express";
import * as ingredient from '../controllers/ingredient.controller.js';

const router = express.Router();

// Route for creating a new ingredient
router.post("/", ingredient.insertIngredient);

// Route for getting all ingredientes
router.get("/", ingredient.showAllIngredientes);

// Route for getting a ingredient by ID
router.get("/:id", ingredient.showIngredient);

// Route for updating a ingredient
router.put("/:id", ingredient.updateIngredient);

// Route for deleting a ingredient
router.delete("/:id", ingredient.deleteIngredient);

// Search ingredient
router.get('/ingredientes/search', ingredient.searchIngredient);

export default router;
