import InventoryStockModel from "../models/inventoryStock.model.js";
import InventoryModel from "../models/inventory.model.js";
import { validateCreateInventoryStock, validateUpdateInventoryStock } from '../validators/inventoryStock.validator.js';

// InventoryStock New
export async function insertInventoryStock(req, res) {
  try {
      const inventoryStockData = req.body;

      // Validate inventoryStock data before insertion
      const { error } = validateCreateInventoryStock(inventoryStockData);
      if (error) {
          return res.status(400).json({ error: error.message });
      }

      // Check if inventoryId is active
      const inventory = await InventoryModel.findById(inventoryStockData.inventoryId);
      if (!inventory || !inventory.is_active) {
        return res.status(400).json({ error: "Inventory is not active" });
      }
  

      // Insert inventoryStock with itemId
      const newInventoryStock = new InventoryStockModel(inventoryStockData);
      const savedInventoryStock = await newInventoryStock.save();

      // Send Response
      res.status(200).json({ message: "InventoryStock data inserted", datashow: savedInventoryStock });
  } catch (error) {
      return res
          .status(500)
          .json({
              success: false,
              message: error.message || "Something went wrong",
          });
  }
}

// InventoryStock List
export async function showAllInventoryStocks(req, res) {
  try {
    const inventoryStock = await InventoryStockModel.find({ is_active: "true" }).select('-password');

    if (!inventoryStock || inventoryStock.length === 0) {
      console.log("InventoryStock not found");
      return res.status(404).json({ message: "InventoryStock not found" });
    }

    res.status(200).json({ inventoryStock });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single InventoryStock
export async function showInventoryStock(req, res) {
  try {
    const inventoryStockId = req.params.id; // Corrected variable name
    const inventoryStock = await InventoryStockModel.findOne({ _id: inventoryStockId }); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const inventoryStock = await InventoryStockModel.find({ _id: id }); // Corrected field name
    console.log(inventoryStock);

    if (!inventoryStock) {
      return res.status(404).json({ message: "InventoryStock not found" });
    }

    res.status(200).json({ inventoryStock });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update InventoryStock
export async function updateInventoryStock(req, res) {
  try {
    const inventoryStockId = req.params.id;
    const inventoryStockDataToUpdate = req.body;

    // Validate inventoryStock data before update
    const { error } = validateUpdateInventoryStock(inventoryStockDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing inventoryStock by inventoryStockId
    const existingInventoryStock = await InventoryStockModel.findOne({ _id: inventoryStockId });
    if (!existingInventoryStock) {
      return res.status(404).json({ message: "InventoryStock not found" });
    }

    // Update inventoryStock fields
    Object.assign(existingInventoryStock, inventoryStockDataToUpdate);
    const updatedInventoryStock = await existingInventoryStock.save();

    // Send the updated inventoryStock as JSON response
    res.status(200).json({ message: "InventoryStock updated successfully", inventoryStock: updatedInventoryStock });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete InventoryStock
export async function deleteInventoryStock(req, res, next) {
  try {
    const inventoryStockId = req.params.id;
    const updatedInventoryStock = await InventoryStockModel.findOneAndUpdate(
      { _id: inventoryStockId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedInventoryStock) {
      return res.status(404).json({ message: "InventoryStock not found." });
    }

    res.status(200).json({ message: "InventoryStock deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

//Search inventoryStock
export async function searchInventoryStock(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query params
    const searchRegex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex pattern for searching

    // Find inventoryStocks that match any field using the regex pattern
    const inventoryStocks = await InventoryStockModel.find({
      $or: [
        { itemName: searchRegex }
      ],
    });

    if (!inventoryStocks || inventoryStocks.length === 0) {
      return res.status(404).json({ message: "No inventoryStocks found" });
    }

    res.status(200).json({ inventoryStocks });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}
