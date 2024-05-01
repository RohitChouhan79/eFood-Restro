import express from "express";
import * as supplier from '../controllers/supplier.controller.js';

const router = express.Router();

// Route for creating a new supplier
router.post("/", supplier.insertSupplier);

// Route for getting all suppliers
router.get("/", supplier.showAllSuppliers);

// Route for getting a supplier by ID
router.get("/:id", supplier.showSupplier);

// Route for updating a supplier
router.put("/:id", supplier.updateSupplier);

// Route for deleting a supplier
router.delete("/:id", supplier.deleteSupplier);

export default router;
