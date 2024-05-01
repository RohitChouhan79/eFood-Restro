import InventoryModel from "../models/inventory.model.js";
import { validateCreateInventory, validateUpdateInventory } from '../validators/inventory.validator.js';

// Inventory New
export async function insertInventory(req, res) {
  try {
      const inventoryData = req.body;

      // Validate inventory data before insertion
      const { error } = validateCreateInventory(inventoryData);
      if (error) {
          return res.status(400).json({ error: error.message });
      }

      // Check if inventoryName already exists in InventoryModel
      const existingInventory = await InventoryModel.findOne({
        inventoryName: inventoryData.inventoryName,
      });
      if (existingInventory) {
        return res
          .status(400)
          .json({ error: "Inventory with the given inventoryName already exists" });
      }

      // Insert inventory with itemId
      const newInventory = new InventoryModel(inventoryData);
      const savedInventory = await newInventory.save();

      // Send Response
      res.status(200).json({ message: "Inventory data inserted", datashow: savedInventory });
  } catch (error) {
      return res
          .status(500)
          .json({
              success: false,
              message: error.message || "Something went wrong",
          });
  }
}

// Inventory List
export async function showAllInventoryes(req, res) {
  try {
    const inventory = await InventoryModel.find({ is_active: "true" }).select('-password');

    if (!inventory || inventory.length === 0) {
      console.log("Inventory not found");
      return res.status(404).json({ message: "Inventory not found" });
    }

    res.status(200).json({ inventory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single Inventory
export async function showInventory(req, res) {
  try {
    const inventoryId = req.params.id; // Corrected variable name
    const inventory = await InventoryModel.findOne({ _id: inventoryId }); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const inventory = await InventoryModel.find({ _id: id }); // Corrected field name
    console.log(inventory);

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    res.status(200).json({ inventory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update Inventory
export async function updateInventory(req, res) {
  try {
    const inventoryId = req.params.id;
    const inventoryDataToUpdate = req.body;

    // Validate inventory data before update
    const { error } = validateUpdateInventory(inventoryDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing inventory by inventoryId
    const existingInventory = await InventoryModel.findOne({ _id: inventoryId });
    if (!existingInventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    // Update inventory fields
    Object.assign(existingInventory, inventoryDataToUpdate);
    const updatedInventory = await existingInventory.save();

    // Send the updated inventory as JSON response
    res.status(200).json({ message: "Inventory updated successfully", inventory: updatedInventory });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete Inventory
export async function deleteInventory(req, res, next) {
  try {
    const inventoryId = req.params.id;
    const updatedInventory = await InventoryModel.findOneAndUpdate(
      { _id: inventoryId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedInventory) {
      return res.status(404).json({ message: "Inventory not found." });
    }

    res.status(200).json({ message: "Inventory deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

//Search inventory
export async function searchInventory(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query params
    const searchRegex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex pattern for searching

    // Find inventoryes that match any field using the regex pattern
    const inventoryes = await InventoryModel.find({
      $or: [
        { inventoryName: searchRegex },
        { location: searchRegex }
      ],
    });

    if (!inventoryes || inventoryes.length === 0) {
      return res.status(404).json({ message: "No inventoryes found" });
    }

    res.status(200).json({ inventoryes });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}
