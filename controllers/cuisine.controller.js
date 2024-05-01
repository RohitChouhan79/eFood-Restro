import CuisineModel from "../models/cuisine.model.js";
import { validateCreateCuisine, validateUpdateCuisine } from '../validators/cuisine.validator.js';

// Cuisine New
export async function insertCuisine(req, res) {
  try {
      const cuisineData = req.body;
      console.log("cuisineData", cuisineData);

      // Validate cuisine data before insertion
      const { error } = validateCreateCuisine(cuisineData);
      if (error) {
          return res.status(400).json({ error: error.message });
      }

      // Check if roleName already exists in CuisineModel
      const existingCuisine = await CuisineModel.findOne({
        cuisineName: cuisineData.cuisineName,
      });
      if (existingCuisine) {
        return res
          .status(400)
          .json({ error: "Cuisine with the given roleName already exists" });
      }

      // Insert cuisine with itemId
      const newCuisine = new CuisineModel(cuisineData);
      const savedCuisine = await newCuisine.save();

      // Send Response
      res.status(200).json({ message: "Cuisine data inserted", datashow: savedCuisine });
  } catch (error) {
      return res
          .status(500)
          .json({
              success: false,
              message: error.message || "Something went wrong",
          });
  }
}

// Cuisine List
export async function showAllCuisines(req, res) {
  try {
    const cuisine = await CuisineModel.find({ is_active: "true" }).select('-password');

    if (!cuisine || cuisine.length === 0) {
      console.log("Cuisine not found");
      return res.status(404).json({ message: "Cuisine not found" });
    }

    res.status(200).json({ cuisine });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single Cuisine
export async function showCuisine(req, res) {
  try {
    const cuisineId = req.params.id; // Corrected variable name
    const cuisine = await CuisineModel.findOne({ _id: cuisineId }); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const cuisine = await CuisineModel.find({ _id: id }); // Corrected field name
    console.log(cuisine);

    if (!cuisine) {
      return res.status(404).json({ message: "Cuisine not found" });
    }

    res.status(200).json({ cuisine });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update Cuisine
export async function updateCuisine(req, res) {
  try {
    const cuisineId = req.params.id;
    const cuisineDataToUpdate = req.body;

    // Validate cuisine data before update
    const { error } = validateUpdateCuisine(cuisineDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing cuisine by cuisineId
    const existingCuisine = await CuisineModel.findOne({ _id: cuisineId });
    if (!existingCuisine) {
      return res.status(404).json({ message: "Cuisine not found" });
    }

    // Update cuisine fields
    Object.assign(existingCuisine, cuisineDataToUpdate);
    const updatedCuisine = await existingCuisine.save();

    // Send the updated cuisine as JSON response
    res.status(200).json({ message: "Cuisine updated successfully", cuisine: updatedCuisine });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete Cuisine
export async function deleteCuisine(req, res, next) {
  try {
    const cuisineId = req.params.id;
    const updatedCuisine = await CuisineModel.findOneAndUpdate(
      { _id: cuisineId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedCuisine) {
      return res.status(404).json({ message: "Cuisine not found." });
    }

    res.status(200).json({ message: "Cuisine deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

//Search cuisine
export async function searchCuisine(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query params
    const searchRegex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex pattern for searching

    // Find cuisines that match any field using the regex pattern
    const cuisines = await CuisineModel.find({
      $or: [
        { cuisineName: searchRegex }
      ],
    });

    if (!cuisines || cuisines.length === 0) {
      return res.status(404).json({ message: "No cuisines found" });
    }

    res.status(200).json({ cuisines });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}
