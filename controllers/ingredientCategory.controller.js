import IngredientCategoryModel from "../models/ingredientCategory.model.js";
import { validateCreateIngredientCategory, validateUpdateIngredientCategory } from '../validators/ingredientCategory.validator.js';

// IngredientCategory New
export async function insertIngredientCategory(req, res) {
  try {
      const ingredientCategoryData = req.body;
      console.log("ingredientCategoryData", ingredientCategoryData);

      // Validate ingredientCategory data before insertion
      const { error } = validateCreateIngredientCategory(ingredientCategoryData);
      if (error) {
          return res.status(400).json({ error: error.message });
      }

      // Insert ingredientCategory with itemId
      const newIngredientCategory = new IngredientCategoryModel(ingredientCategoryData);
      const savedIngredientCategory = await newIngredientCategory.save();

      // Send Response
      res.status(200).json({ message: "IngredientCategory data inserted", datashow: savedIngredientCategory });
  } catch (error) {
      return res
          .status(500)
          .json({
              success: false,
              message: error.message || "Something went wrong",
          });
  }
}

// IngredientCategory List
export async function showAllIngredientCategorys(req, res) {
  try {
    const ingredientCategory = await IngredientCategoryModel.find({ is_active: "true" });

    if (!ingredientCategory || ingredientCategory.length === 0) {
      console.log("IngredientCategory not found");
      return res.status(404).json({ message: "IngredientCategory not found" });
    }

    res.status(200).json({ ingredientCategory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single IngredientCategory
export async function showIngredientCategory(req, res) {
  try {
    const ingredientCategoryId = req.params.id; // Corrected variable name
    const ingredientCategory = await IngredientCategoryModel.findOne({ _id: ingredientCategoryId }); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const ingredientCategory = await IngredientCategoryModel.find({ _id: id }); // Corrected field name
    console.log(ingredientCategory);

    if (!ingredientCategory) {
      return res.status(404).json({ message: "IngredientCategory not found" });
    }

    res.status(200).json({ ingredientCategory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update IngredientCategory
export async function updateIngredientCategory(req, res) {
  try {
    const ingredientCategoryId = req.params.id;
    const ingredientCategoryDataToUpdate = req.body;

    // Validate ingredientCategory data before update
    const { error } = validateUpdateIngredientCategory(ingredientCategoryDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing ingredientCategory by ingredientCategoryId
    const existingIngredientCategory = await IngredientCategoryModel.findOne({ _id: ingredientCategoryId });
    if (!existingIngredientCategory) {
      return res.status(404).json({ message: "IngredientCategory not found" });
    }

    // Update ingredientCategory fields
    Object.assign(existingIngredientCategory, ingredientCategoryDataToUpdate);
    const updatedIngredientCategory = await existingIngredientCategory.save();

    // Send the updated ingredientCategory as JSON response
    res.status(200).json({ message: "IngredientCategory updated successfully", ingredientCategory: updatedIngredientCategory });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete IngredientCategory
export async function deleteIngredientCategory(req, res, next) {
  try {
    const ingredientCategoryId = req.params.id;
    const updatedIngredientCategory = await IngredientCategoryModel.findOneAndUpdate(
      { _id: ingredientCategoryId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedIngredientCategory) {
      return res.status(404).json({ message: "IngredientCategory not found." });
    }

    res.status(200).json({ message: "IngredientCategory deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

//Search ingredientCategory
export async function searchIngredientCategory(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query params
    const searchRegex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex pattern for searching

    // Find ingredientCategorys that match any field using the regex pattern
    const ingredientCategorys = await IngredientCategoryModel.find({
      $or: [
        { ingredientCategoryName: searchRegex }
      ],
    });

    if (!ingredientCategorys || ingredientCategorys.length === 0) {
      return res.status(404).json({ message: "No ingredientCategorys found" });
    }

    res.status(200).json({ ingredientCategorys });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}
