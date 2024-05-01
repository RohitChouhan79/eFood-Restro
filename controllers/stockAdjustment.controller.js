import StockAdjustmentModel from "../models/stockAdjustment.model.js";
import { validateCreateStockAdjustment, validateUpdateStockAdjustment } from '../validators/stockAdjustment.validator.js';

// StockAdjustment New
export async function insertStockAdjustment(req, res) {
  try {
      const stockAdjustmentData = req.body;
      console.log("stockAdjustmentData", stockAdjustmentData);

      // Validate stockAdjustment data before insertion
      const { error } = validateCreateStockAdjustment(stockAdjustmentData);
      if (error) {
          return res.status(400).json({ error: error.message });
      }

      // Insert stockAdjustment with itemId
      const newStockAdjustment = new StockAdjustmentModel(stockAdjustmentData);
      const savedStockAdjustment = await newStockAdjustment.save();

      // Send Response
      res.status(200).json({ message: "StockAdjustment data inserted", datashow: savedStockAdjustment });
  } catch (error) {
      return res
          .status(500)
          .json({
              success: false,
              message: error.message || "Something went wrong",
          });
  }
}

// StockAdjustment List
export async function showAllStockAdjustments(req, res) {
  try {
    const stockAdjustment = await StockAdjustmentModel.find({ is_active: "true" });

    if (!stockAdjustment || stockAdjustment.length === 0) {
      console.log("StockAdjustment not found");
      return res.status(404).json({ message: "StockAdjustment not found" });
    }

    res.status(200).json({ stockAdjustment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single StockAdjustment
export async function showStockAdjustment(req, res) {
  try {
    const stockAdjustmentId = req.params.id; // Corrected variable name
    const stockAdjustment = await StockAdjustmentModel.findOne({ _id: stockAdjustmentId }); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const stockAdjustment = await StockAdjustmentModel.find({ _id: id }); // Corrected field name
    console.log(stockAdjustment);

    if (!stockAdjustment) {
      return res.status(404).json({ message: "StockAdjustment not found" });
    }

    res.status(200).json({ stockAdjustment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update StockAdjustment
export async function updateStockAdjustment(req, res) {
  try {
    const stockAdjustmentId = req.params.id;
    const stockAdjustmentDataToUpdate = req.body;

    // Validate stockAdjustment data before update
    const { error } = validateUpdateStockAdjustment(stockAdjustmentDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing stockAdjustment by stockAdjustmentId
    const existingStockAdjustment = await StockAdjustmentModel.findOne({ _id: stockAdjustmentId });
    if (!existingStockAdjustment) {
      return res.status(404).json({ message: "StockAdjustment not found" });
    }

    // Update stockAdjustment fields
    Object.assign(existingStockAdjustment, stockAdjustmentDataToUpdate);
    const updatedStockAdjustment = await existingStockAdjustment.save();

    // Send the updated stockAdjustment as JSON response
    res.status(200).json({ message: "StockAdjustment updated successfully", stockAdjustment: updatedStockAdjustment });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete StockAdjustment
export async function deleteStockAdjustment(req, res, next) {
  try {
    const stockAdjustmentId = req.params.id;
    const updatedStockAdjustment = await StockAdjustmentModel.findOneAndUpdate(
      { _id: stockAdjustmentId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedStockAdjustment) {
      return res.status(404).json({ message: "StockAdjustment not found." });
    }

    res.status(200).json({ message: "StockAdjustment deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}