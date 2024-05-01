import express from "express";
import * as addOn from '../controllers/addOn.controller.js';

const router = express.Router();

// Route for creating a new addOn
router.post("/", addOn.insertAddOn);

// Route for getting all addOns
router.get("/", addOn.showAllAddOns);

// Route for getting a addOn by ID
router.get("/:id", addOn.showAddOn);

// Route for updating a addOn
router.put("/:id", addOn.updateAddOn);

// Route for deleting a addOn
router.delete("/:id", addOn.deleteAddOn);

// Search addOn
router.get('/addOns/search', addOn.searchAddOn);

export default router;
