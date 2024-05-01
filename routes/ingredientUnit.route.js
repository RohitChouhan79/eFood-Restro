import express from "express";
import * as ingredientUnit from '../controllers/ingredientUnit.controller.js';

const router = express.Router();

// Route for creating a new ingredientUnit
router.post("/", ingredientUnit.insertIngredientUnit);

// Route for getting all ingredientUnits
router.get("/", ingredientUnit.showAllIngredientUnits);

// Route for getting a ingredientUnit by ID
router.get("/:id", ingredientUnit.showIngredientUnit);

// Route for updating a ingredientUnit
router.put("/:id", ingredientUnit.updateIngredientUnit);

// Route for deleting a ingredientUnit
router.delete("/:id", ingredientUnit.deleteIngredientUnit);

// Search ingredientUnit
router.get('/ingredientUnits/search', ingredientUnit.searchIngredientUnit);


export default router;
