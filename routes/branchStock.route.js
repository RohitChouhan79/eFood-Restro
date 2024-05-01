import express from "express";
import * as branchStock from '../controllers/branchStock.controller.js';

const router = express.Router();

// Route for creating a new branchStock
router.post("/", branchStock.insertBranchStock);

// Route for getting all branchStockes
router.get("/", branchStock.showAllBranchStockes);

// Route for getting a branchStock by ID
router.get("/:id", branchStock.showBranchStock);

// Route for updating a branchStock
router.put("/:id", branchStock.updateBranchStock);

// Route for deleting a branchStock
router.delete("/:id", branchStock.deleteBranchStock);

export default router;
