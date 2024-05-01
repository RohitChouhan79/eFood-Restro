import express from "express";
import * as table from '../controllers/table.controller.js';

const router = express.Router();

// Route for creating a new table
router.post("/", table.insertTable);

// Route for getting all tables
router.get("/", table.showAllTables);

// Route for getting a table by ID
router.get("/:id", table.showTable);

// Route for updating a table
router.put("/:id", table.updateTable);

// Route for deleting a table
router.delete("/:id", table.deleteTable);

export default router;
