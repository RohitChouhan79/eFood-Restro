import AreaModel from "../models/area.model.js";
import { validateCreateArea, validateUpdateArea } from '../validators/area.validator.js';

// Area New
export async function insertArea(req, res) {
  try {
      const areaData = req.body;

      // Validate area data before insertion
      const { error } = validateCreateArea(areaData);
      if (error) {
          return res.status(400).json({ error: error.message });
      }

      // Check if areaName already exists in AreaModel
      const existingArea = await AreaModel.findOne({
        areaName: areaData.areaName,
      });
      if (existingArea) {
        return res
          .status(400)
          .json({ error: "Area with the given areaName already exists" });
      }

      // Insert area with itemId
      const newArea = new AreaModel(areaData);
      const savedArea = await newArea.save();

      // Send Response
      res.status(200).json({ message: "Area data inserted", datashow: savedArea });
  } catch (error) {
      return res
          .status(500)
          .json({
              success: false,
              message: error.message || "Something went wrong",
          });
  }
}

// Area List
export async function showAllAreaes(req, res) {
  try {
    const area = await AreaModel.find({ is_active: "true" }).select('-password');

    if (!area || area.length === 0) {
      console.log("Area not found");
      return res.status(404).json({ message: "Area not found" });
    }

    res.status(200).json({ area });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single Area
export async function showArea(req, res) {
  try {
    const areaId = req.params.id; // Corrected variable name
    const area = await AreaModel.findOne({ _id: areaId }); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const area = await AreaModel.find({ _id: id }); // Corrected field name
    console.log(area);

    if (!area) {
      return res.status(404).json({ message: "Area not found" });
    }

    res.status(200).json({ area });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update Area
export async function updateArea(req, res) {
  try {
    const areaId = req.params.id;
    const areaDataToUpdate = req.body;

    // Validate area data before update
    const { error } = validateUpdateArea(areaDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing area by areaId
    const existingArea = await AreaModel.findOne({ _id: areaId });
    if (!existingArea) {
      return res.status(404).json({ message: "Area not found" });
    }

    // Update area fields
    Object.assign(existingArea, areaDataToUpdate);
    const updatedArea = await existingArea.save();

    // Send the updated area as JSON response
    res.status(200).json({ message: "Area updated successfully", area: updatedArea });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete Area
export async function deleteArea(req, res, next) {
  try {
    const areaId = req.params.id;
    const updatedArea = await AreaModel.findOneAndUpdate(
      { _id: areaId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedArea) {
      return res.status(404).json({ message: "Area not found." });
    }

    res.status(200).json({ message: "Area deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

//Search area
export async function searchArea(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query params
    const searchRegex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex pattern for searching

    // Find areaes that match any field using the regex pattern
    const areaes = await AreaModel.find({
      $or: [
        { areaName: searchRegex },
        { 'address.streetName': searchRegex },
        { 'address.landMark': searchRegex },
        { 'address.city': searchRegex },
        { 'address.pinCode': searchRegex },
        { 'address.state': searchRegex },
        { 'address.country': searchRegex }
      ],
    });

    if (!areaes || areaes.length === 0) {
      return res.status(404).json({ message: "No areaes found" });
    }

    res.status(200).json({ areaes });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}
