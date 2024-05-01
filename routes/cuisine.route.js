import express from "express";
import * as cuisine from '../controllers/cuisine.controller.js';

const router = express.Router();

// Route for creating a new cuisine
router.post("/", cuisine.insertCuisine);

// Route for getting all cuisines
router.get("/", cuisine.showAllCuisines);

// Route for getting a cuisine by ID
router.get("/:id", cuisine.showCuisine);

// Route for updating a cuisine
router.put("/:id", cuisine.updateCuisine);

// Route for deleting a cuisine
router.delete("/:id", cuisine.deleteCuisine);

// Search cuisine
router.get('/cuisines/search', cuisine.searchCuisine);

// Search cuisine
router.get('/cuisines/search', cuisine.searchCuisine);


export default router;
