import express from "express";
import * as modifier from '../controllers/modifier.controller.js';

const router = express.Router();

// Route for creating a new modifier
router.post("/", modifier.insertModifier);

// Route for getting all modifiers
router.get("/", modifier.showAllModifiers);

// Route for getting a modifier by ID
router.get("/:id", modifier.showModifier);

// Route for updating a modifier
router.put("/:id", modifier.updateModifier);

// Route for deleting a modifier
router.delete("/:id", modifier.deleteModifier);

// Search modifier
router.get('/modifiers/search', modifier.searchModifier);

export default router;
