import express from "express";
import * as addFund from '../controllers/addFund.controller.js';

const router = express.Router();

// Route for creating a new addFund
router.post("/", addFund.insertAddFund);

// Route for getting all addFunds
router.get("/", addFund.showAllAddFunds);

// Route for getting a addFund by ID
router.get("/:id", addFund.showAddFund);

// Route for updating a addFund
router.put("/:id", addFund.updateAddFund);

// Route for deleting a addFund
router.delete("/:id", addFund.deleteAddFund);

export default router;
