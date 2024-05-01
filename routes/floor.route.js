import express from "express";
import * as floor from '../controllers/floor.controller.js';

const router = express.Router();

// Route for creating a new floor
router.post("/", floor.insertFloor);

// Route for getting all floors
router.get("/", floor.showAllFloors);

// Route for getting a floor by ID
router.get("/:id", floor.showFloor);

// Route for updating a floor
router.put("/:id", floor.updateFloor);

// Route for deleting a floor
router.delete("/:id", floor.deleteFloor);

export default router;
