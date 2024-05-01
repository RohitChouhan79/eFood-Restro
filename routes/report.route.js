import express from "express";
import * as report from '../controllers/report.controller.js';

const router = express.Router();

// Route for creating a new report
router.post("/", report.insertReport);

// Route for getting all reports
router.get("/", report.showAllReports);

// Route for getting a report by ID
router.get("/:id", report.showReport);

// Route for updating a report
router.put("/:id", report.updateReport);

// Route for deleting a report
router.delete("/:id", report.deleteReport);

export default router;
