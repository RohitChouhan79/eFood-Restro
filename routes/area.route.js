import express from "express";
import * as area from '../controllers/area.controller.js';

const router = express.Router();

// Route for creating a new area
router.post("/", area.insertArea);

// Route for getting all areaes
router.get("/", area.showAllAreaes);

// Route for getting a area by ID
router.get("/:id", area.showArea);

// Route for updating a area
router.put("/:id", area.updateArea);

// Route for deleting a area
router.delete("/:id", area.deleteArea);

// Search area
router.get('/areaes/search', area.searchArea);

export default router;
