import PurchaseModel from "../models/purchase.model.js";
import InventoryModel from "../models/inventory.model.js";
import SupplierModel from "../models/supplier.model.js";
import { validateCreatePurchase, validateUpdatePurchase } from '../validators/purchase.validator.js';

// Purchase New
export async function insertPurchase(req, res) {
  try {
      const purchaseData = req.body;

      // Validate purchase data before insertion
      const { error } = validateCreatePurchase(purchaseData);
      if (error) {
          return res.status(400).json({ error: error.message });
      }

      // Check if customerId is active
      const inventory = await InventoryModel.findById(purchaseData.inventoryId);
      if (!inventory || !inventory.is_active) {
        return res.status(400).json({ error: "Inventory is not active" });
      }

      // Check if customerId is active
      const supplier = await SupplierModel.findById(purchaseData.supplierId);
      if (!supplier || !supplier.is_active) {
        return res.status(400).json({ error: "Supplier is not active" });
      }

      // Insert purchase with itemId
      const newPurchase = new PurchaseModel(purchaseData);
      const savedPurchase = await newPurchase.save();

      // Send Response
      res.status(200).json({ message: "Purchase data inserted", datashow: savedPurchase });
  } catch (error) {
      return res
          .status(500)
          .json({
              success: false,
              message: error.message || "Something went wrong",
          });
  }
}

// Purchase List
export async function showAllPurchasees(req, res) {
  try {
    const purchase = await PurchaseModel.find({ is_active: "true" }).select('-password');

    if (!purchase || purchase.length === 0) {
      console.log("Purchase not found");
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.status(200).json({ purchase });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single Purchase
export async function showPurchase(req, res) {
  try {
    const purchaseId = req.params.id; // Corrected variable name
    const purchase = await PurchaseModel.findOne({ _id: purchaseId }); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const purchase = await PurchaseModel.find({ _id: id }); // Corrected field name
    console.log(purchase);

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.status(200).json({ purchase });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update Purchase
export async function updatePurchase(req, res) {
  try {
    const purchaseId = req.params.id;
    const purchaseDataToUpdate = req.body;

    // Validate purchase data before update
    const { error } = validateUpdatePurchase(purchaseDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing purchase by purchaseId
    const existingPurchase = await PurchaseModel.findOne({ _id: purchaseId });
    if (!existingPurchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    // Update purchase fields
    Object.assign(existingPurchase, purchaseDataToUpdate);
    const updatedPurchase = await existingPurchase.save();

    // Send the updated purchase as JSON response
    res.status(200).json({ message: "Purchase updated successfully", purchase: updatedPurchase });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete Purchase
export async function deletePurchase(req, res, next) {
  try {
    const purchaseId = req.params.id;
    const updatedPurchase = await PurchaseModel.findOneAndUpdate(
      { _id: purchaseId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedPurchase) {
      return res.status(404).json({ message: "Purchase not found." });
    }

    res.status(200).json({ message: "Purchase deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}
