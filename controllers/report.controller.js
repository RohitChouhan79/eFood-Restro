import ReportModel from "../models/report.model.js";
import { validateCreateReport, validateUpdateReport } from '../validators/report.validator.js';

// Report New
export async function insertReport(req, res) {
  try {
      const reportData = req.body;
      console.log("reportData", reportData);

      // Validate report data before insertion
      const { error } = validateCreateReport(reportData);
      if (error) {
          return res.status(400).json({ error: error.message });
      }

      // Insert report with itemId
      const newReport = new ReportModel(reportData);
      const savedReport = await newReport.save();

      // Send Response
      res.status(200).json({ message: "Report data inserted", datashow: savedReport });
  } catch (error) {
      return res
          .status(500)
          .json({
              success: false,
              message: error.message || "Something went wrong",
          });
  }
}

// Report List
export async function showAllReports(req, res) {
  try {
    const report = await ReportModel.find({ is_active: "true" }).select('-password');

    if (!report || report.length === 0) {
      console.log("Report not found");
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ report });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single Report
export async function showReport(req, res) {
  try {
    const reportId = req.params.id; // Corrected variable name
    const report = await ReportModel.findOne({ _id: reportId }); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const report = await ReportModel.find({ _id: id }); // Corrected field name
    console.log(report);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ report });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update Report
export async function updateReport(req, res) {
  try {
    const reportId = req.params.id;
    const reportDataToUpdate = req.body;

    // Validate report data before update
    const { error } = validateUpdateReport(reportDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing report by reportId
    const existingReport = await ReportModel.findOne({ _id: reportId });
    if (!existingReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Update report fields
    Object.assign(existingReport, reportDataToUpdate);
    const updatedReport = await existingReport.save();

    // Send the updated report as JSON response
    res.status(200).json({ message: "Report updated successfully", report: updatedReport });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete Report
export async function deleteReport(req, res, next) {
  try {
    const reportId = req.params.id;
    const updatedReport = await ReportModel.findOneAndUpdate(
      { _id: reportId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found." });
    }

    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}