import AddOnModel from "../models/addOn.model.js";
import { validateCreateAddOn, validateUpdateAddOn } from '../validators/addOn.validator.js';

// AddOn New
export async function insertAddOn(req, res) {
  try {
      const addOnData = req.body;
      console.log("addOnData", addOnData);

      // Validate addOn data before insertion
      const { error } = validateCreateAddOn(addOnData);
      if (error) {
          return res.status(400).json({ error: error.message });
      }

      // Check if roleName already exists in AddOnModel
      const existingAddOn = await AddOnModel.findOne({
        addOnName: addOnData.addOnName,
      });
      if (existingAddOn) {
        return res
          .status(400)
          .json({ error: "AddOn with the given roleName already exists" });
      }

      // Insert addOn with itemId
      const newAddOn = new AddOnModel(addOnData);
      const savedAddOn = await newAddOn.save();

      // Send Response
      res.status(200).json({ message: "AddOn data inserted", datashow: savedAddOn });
  } catch (error) {
      return res
          .status(500)
          .json({
              success: false,
              message: error.message || "Something went wrong",
          });
  }
}

// AddOn List
export async function showAllAddOns(req, res) {
  try {
    const addOn = await AddOnModel.find({ is_active: "true" }).select('-password');

    if (!addOn || addOn.length === 0) {
      console.log("AddOn not found");
      return res.status(404).json({ message: "AddOn not found" });
    }

    res.status(200).json({ addOn });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single AddOn
export async function showAddOn(req, res) {
  try {
    const addOnId = req.params.id; // Corrected variable name
    const addOn = await AddOnModel.findOne({ _id: addOnId }); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const addOn = await AddOnModel.find({ _id: id }); // Corrected field name
    console.log(addOn);

    if (!addOn) {
      return res.status(404).json({ message: "AddOn not found" });
    }

    res.status(200).json({ addOn });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update AddOn
export async function updateAddOn(req, res) {
  try {
    const addOnId = req.params.id;
    const addOnDataToUpdate = req.body;

    // Validate addOn data before update
    const { error } = validateUpdateAddOn(addOnDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing addOn by addOnId
    const existingAddOn = await AddOnModel.findOne({ _id: addOnId });
    if (!existingAddOn) {
      return res.status(404).json({ message: "AddOn not found" });
    }

    // Update addOn fields
    Object.assign(existingAddOn, addOnDataToUpdate);
    const updatedAddOn = await existingAddOn.save();

    // Send the updated addOn as JSON response
    res.status(200).json({ message: "AddOn updated successfully", addOn: updatedAddOn });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete AddOn
export async function deleteAddOn(req, res, next) {
  try {
    const addOnId = req.params.id;
    const updatedAddOn = await AddOnModel.findOneAndUpdate(
      { _id: addOnId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedAddOn) {
      return res.status(404).json({ message: "AddOn not found." });
    }

    res.status(200).json({ message: "AddOn deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

//Search addOn
export async function searchAddOn(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query params
    const searchRegex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex pattern for searching

    // Find addOns that match any field using the regex pattern
    const addOns = await AddOnModel.find({
      $or: [
        { addOnName: searchRegex }
      ],
    });

    if (!addOns || addOns.length === 0) {
      return res.status(404).json({ message: "No addOns found" });
    }

    res.status(200).json({ addOns });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}
