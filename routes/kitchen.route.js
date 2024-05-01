import express from "express";
import * as kitchen from '../controllers/kitchen.controller.js';

const router = express.Router();

// Route for creating a new kitchen
router.post("/", kitchen.insertKitchen);

// Route for getting all kitchens
router.get("/", kitchen.showAllKitchens);

// Route for getting a kitchen by ID
router.get("/:id", kitchen.showKitchen);

// Route for updating a kitchen
router.put("/:id", kitchen.updateKitchen);

// Route for deleting a kitchen
router.delete("/:id", kitchen.deleteKitchen);

export default router;
