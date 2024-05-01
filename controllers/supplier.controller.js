import SupplierModel from "../models/supplier.model.js";
import { validateCreateSupplier, validateUpdateSupplier } from '../validators/supplier.validator.js';

// Supplier New
export async function insertSupplier(req, res) {
  try {
      const supplierData = req.body;
      console.log("supplierData", supplierData);

      // Validate supplier data before insertion
      const { error } = validateCreateSupplier(supplierData);
      if (error) {
          return res.status(400).json({ error: error.message });
      }

      // Insert supplier with itemId
      const newSupplier = new SupplierModel(supplierData);
      const savedSupplier = await newSupplier.save();

      // Send Response
      res.status(200).json({ message: "Supplier data inserted", datashow: savedSupplier });
  } catch (error) {
      return res
          .status(500)
          .json({
              success: false,
              message: error.message || "Something went wrong",
          });
  }
}

// Supplier List
export async function showAllSuppliers(req, res) {
  try {
    const supplier = await SupplierModel.find({ is_active: "true" }).select('-password');

    if (!supplier || supplier.length === 0) {
      console.log("Supplier not found");
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json({ supplier });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single Supplier
export async function showSupplier(req, res) {
  try {
    const supplierId = req.params.id; // Corrected variable name
    const supplier = await SupplierModel.findOne({ _id: supplierId })
      .select('-password')
      .populate({ path: 'branchId', select: '-password' })

    console.log(supplier);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json({ supplier });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update Supplier
export async function updateSupplier(req, res) {
  try {
    const supplierId = req.params.id;
    const supplierDataToUpdate = req.body;

    // Validate supplier data before update
    const { error } = validateUpdateSupplier(supplierDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing supplier by supplierId
    const existingSupplier = await SupplierModel.findOne({ _id: supplierId });
    if (!existingSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Update supplier fields
    Object.assign(existingSupplier, supplierDataToUpdate);
    const updatedSupplier = await existingSupplier.save();

    // Send the updated supplier as JSON response
    res.status(200).json({ message: "Supplier updated successfully", supplier: updatedSupplier });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete Supplier
export async function deleteSupplier(req, res, next) {
  try {
    const supplierId = req.params.id;
    const updatedSupplier = await SupplierModel.findOneAndUpdate(
      { _id: supplierId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedSupplier) {
      return res.status(404).json({ message: "Supplier not found." });
    }

    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

//Search supplier
export async function searchSupplier(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query params
    const searchRegex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex pattern for searching

    // Find suppliers that match any field using the regex pattern
    const suppliers = await SupplierModel.find({
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { emailAddress: searchRegex },
        { 'address.streetName': searchRegex },
        { 'address.landMark': searchRegex },
        { 'address.city': searchRegex },
        { 'address.pinCode': searchRegex },
        { 'address.state': searchRegex },
        { 'address.country': searchRegex }
      ],
    });

    if (!suppliers || suppliers.length === 0) {
      return res.status(404).json({ message: "No suppliers found" });
    }

    res.status(200).json({ suppliers });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}
