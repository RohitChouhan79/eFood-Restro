import BranchStockModel from "../models/branchStock.model.js";
import BranchModel from "../models/branch.model.js";
import { validateCreateBranchStock, validateUpdateBranchStock } from '../validators/branchStock.validator.js';

// BranchStock New
export async function insertBranchStock(req, res) {
  try {
      const branchStockData = req.body;
      console.log("req.body.itmes", req.body.itmes);

      // Validate branchStock data before insertion
      const { error } = validateCreateBranchStock(branchStockData);
      if (error) {
          return res.status(400).json({ error: error.message });
      }
      
      // Check if branchId is active
      const branch = await BranchModel.findById(branchStockData.branchId);
      if (!branch || !branch.is_active) {
        return res.status(400).json({ error: "Branch is not active" });
      }


      // Insert branchStock with itemId
      const newBranchStock = new BranchStockModel(branchStockData);
      const savedBranchStock = await newBranchStock.save();

      // Send Response
      res.status(200).json({ message: "BranchStock data inserted", datashow: savedBranchStock });
  } catch (error) {
      return res
          .status(500)
          .json({
              success: false,
              message: error.message || "Something went wrong",
          });
  }
}

// BranchStock List
export async function showAllBranchStockes(req, res) {
  try {
    const branchStock = await BranchStockModel.find({ is_active: "true" });

    if (!branchStock || branchStock.length === 0) {
      console.log("BranchStock not found");
      return res.status(404).json({ message: "BranchStock not found" });
    }

    res.status(200).json({ branchStock });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single BranchStock
export async function showBranchStock(req, res) {
  try {
    const branchStockId = req.params.id; // Corrected variable name
    const branchStock = await BranchStockModel.findOne({ _id: branchStockId }); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const branchStock = await BranchStockModel.find({ _id: id }); // Corrected field name
    console.log(branchStock);

    if (!branchStock) {
      return res.status(404).json({ message: "BranchStock not found" });
    }

    res.status(200).json({ branchStock });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update BranchStock
export async function updateBranchStock(req, res) {
  try {
    const branchStockId = req.params.id;
    const branchStockDataToUpdate = req.body;

    // Validate branchStock data before update
    const { error } = validateUpdateBranchStock(branchStockDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing branchStock by branchStockId
    const existingBranchStock = await BranchStockModel.findOne({ _id: branchStockId });
    if (!existingBranchStock) {
      return res.status(404).json({ message: "BranchStock not found" });
    }

    // Update branchStock fields
    Object.assign(existingBranchStock, branchStockDataToUpdate);
    const updatedBranchStock = await existingBranchStock.save();

    // Send the updated branchStock as JSON response
    res.status(200).json({ message: "BranchStock updated successfully", branchStock: updatedBranchStock });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete BranchStock
export async function deleteBranchStock(req, res, next) {
  try {
    const branchStockId = req.params.id;
    const updatedBranchStock = await BranchStockModel.findOneAndUpdate(
      { _id: branchStockId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedBranchStock) {
      return res.status(404).json({ message: "BranchStock not found." });
    }

    res.status(200).json({ message: "BranchStock deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}
