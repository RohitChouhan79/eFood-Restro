import PurchaseItemModel from "../models/purchaseItem.model.js";
import PurchaseModel from "../models/purchase.model.js";
import IngredientModel from "../models/ingredient.model.js";
import { validateCreatePurchaseItem, validateUpdatePurchaseItem } from '../validators/purchaseItem.validator.js';
import bcrypt from "bcrypt";

// PurchaseItem New
export async function insertPurchaseItem(req, res) {
  try {
      const purchaseItemData = req.body;
      console.log("purchaseItemData", purchaseItemData);

      // Validate purchaseItem data before insertion
      const { error } = validateCreatePurchaseItem(purchaseItemData);
      if (error) {
          return res.status(400).json({ error: error.message });
      }

      // Check if branchId is active
      const purchase = await PurchaseModel.findById(purchaseItemData.purchaseId);
      if (!purchase || !purchase.is_active) {
        return res.status(400).json({ error: "Purchase is not active" });
      }
  
      // Check if branchId is active
      const ingredient = await IngredientModel.findById(purchaseItemData.itemId);
      if (!ingredient || !ingredient.is_active) {
        return res.status(400).json({ error: "Ingredient is not active" });
      }

      // Insert purchaseItem with itemId
      const newPurchaseItem = new PurchaseItemModel(purchaseItemData);
      const savedPurchaseItem = await newPurchaseItem.save();

      // Send Response
      res.status(200).json({ message: "PurchaseItem data inserted", datashow: savedPurchaseItem });
  } catch (error) {
      return res
          .status(500)
          .json({
              success: false,
              message: error.message || "Something went wrong",
          });
  }
}

// PurchaseItem List
export async function showAllPurchaseItems(req, res) {
  try {
    const purchaseItem = await PurchaseItemModel.find({ is_active: "true" }).select('-password');

    if (!purchaseItem || purchaseItem.length === 0) {
      console.log("PurchaseItem not found");
      return res.status(404).json({ message: "PurchaseItem not found" });
    }

    res.status(200).json({ purchaseItem });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single PurchaseItem
export async function showPurchaseItem(req, res) {
  try {
    const purchaseItemId = req.params.id; // Corrected variable name
    const purchaseItem = await PurchaseItemModel.findOne({ _id: purchaseItemId })
      .populate('purchaseId')
      .populate('itemId')
      .populate('modifiedBy')

    console.log(purchaseItem);

    if (!purchaseItem) {
      return res.status(404).json({ message: "PurchaseItem not found" });
    }

    res.status(200).json({ purchaseItem });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update PurchaseItem
export async function updatePurchaseItem(req, res) {
  try {
    const purchaseItemId = req.params.id;
    const purchaseItemDataToUpdate = req.body;

    // Validate purchaseItem data before update
    const { error } = validateUpdatePurchaseItem(purchaseItemDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing purchaseItem by purchaseItemId
    const existingPurchaseItem = await PurchaseItemModel.findOne({ _id: purchaseItemId });
    if (!existingPurchaseItem) {
      return res.status(404).json({ message: "PurchaseItem not found" });
    }

    // Update purchaseItem fields
    Object.assign(existingPurchaseItem, purchaseItemDataToUpdate);
    const updatedPurchaseItem = await existingPurchaseItem.save();

    // Send the updated purchaseItem as JSON response
    res.status(200).json({ message: "PurchaseItem updated successfully", purchaseItem: updatedPurchaseItem });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete PurchaseItem
export async function deletePurchaseItem(req, res, next) {
  try {
    const purchaseItemId = req.params.id;
    const updatedPurchaseItem = await PurchaseItemModel.findOneAndUpdate(
      { _id: purchaseItemId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedPurchaseItem) {
      return res.status(404).json({ message: "PurchaseItem not found." });
    }

    res.status(200).json({ message: "PurchaseItem deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

//Search purchaseItem
export async function searchPurchaseItem(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query params
    const searchRegex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex pattern for searching

    // Find purchaseItems that match any field using the regex pattern
    const purchaseItems = await PurchaseItemModel.find({
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { identityType: searchRegex },
        { emailAddress: searchRegex },
        { 'address.streetName': searchRegex },
        { 'address.landMark': searchRegex },
        { 'address.city': searchRegex },
        { 'address.pinCode': searchRegex },
        { 'address.state': searchRegex },
        { 'address.country': searchRegex }
      ],
    });

    if (!purchaseItems || purchaseItems.length === 0) {
      return res.status(404).json({ message: "No purchaseItems found" });
    }

    res.status(200).json({ purchaseItems });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}
