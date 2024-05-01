import express from "express";
import * as kot from '../controllers/kot.controller.js';

const router = express.Router();

// Route for creating a new kot
router.post("/", kot.insertKOT);

// Route for getting all kots
router.get("/", kot.showAllKOTs);

// Route for getting a kot by ID
router.get("/:id", kot.showKOT);

// Route for updating a kot
router.put("/:id", kot.updateKOT);

// Route for deleting a kot
router.delete("/:id", kot.deleteKOT);

export default router;
