import express from "express";
import * as veriation from '../controllers/veriation.controller.js';

const router = express.Router();

// Route for creating a new veriation
router.post("/", veriation.insertVeriation);

// Route for getting all veriations
router.get("/", veriation.showAllVeriations);

// Route for getting a veriation by ID
router.get("/:id", veriation.showVeriation);

// Route for updating a veriation
router.put("/:id", veriation.updateVeriation);

// Route for deleting a veriation
router.delete("/:id", veriation.deleteVeriation);

// Search veriation
router.get('/veriations/search', veriation.searchVeriation);

export default router;
