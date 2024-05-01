import FoodCategoryModel from "../models/foodCategory.model.js";
import { validateCreateFoodCategory, validateUpdateFoodCategory } from '../validators/foodCategory.validator.js';

// FoodCategory New
export async function insertFoodCategory(req, res) {
  try {
      const foodCategoryData = req.body;
      console.log("foodCategoryData", foodCategoryData);

      // Validate foodCategory data before insertion
      const { error } = validateCreateFoodCategory(foodCategoryData);
      if (error) {
          return res.status(400).json({ error: error.message });
      }

      // Check if roleName already exists in FoodCategoryModel
      const existingFoodCategory = await FoodCategoryModel.findOne({
        foodCategoryName: foodCategoryData.foodCategoryName,
      });
      if (existingFoodCategory) {
        return res
          .status(400)
          .json({ error: "FoodCategory with the given roleName already exists" });
      }

      // Insert foodCategory with itemId
      const newFoodCategory = new FoodCategoryModel(foodCategoryData);
      const savedFoodCategory = await newFoodCategory.save();

      // Send Response
      res.status(200).json({ message: "FoodCategory data inserted", datashow: savedFoodCategory });
  } catch (error) {
      return res
          .status(500)
          .json({
              success: false,
              message: error.message || "Something went wrong",
          });
  }
}

// FoodCategory List
export async function showAllFoodCategorys(req, res) {
  try {
    const foodCategory = await FoodCategoryModel.find({ is_active: "true" }).select('-password');

    if (!foodCategory || foodCategory.length === 0) {
      console.log("FoodCategory not found");
      return res.status(404).json({ message: "FoodCategory not found" });
    }

    res.status(200).json({ foodCategory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single FoodCategory
export async function showFoodCategory(req, res) {
  try {
    const foodCategoryId = req.params.id; // Corrected variable name
    const foodCategory = await FoodCategoryModel.findOne({ _id: foodCategoryId }); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const foodCategory = await FoodCategoryModel.find({ _id: id }); // Corrected field name
    console.log(foodCategory);

    if (!foodCategory) {
      return res.status(404).json({ message: "FoodCategory not found" });
    }

    res.status(200).json({ foodCategory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update FoodCategory
export async function updateFoodCategory(req, res) {
  try {
    const foodCategoryId = req.params.id;
    const foodCategoryDataToUpdate = req.body;

    // Validate foodCategory data before update
    const { error } = validateUpdateFoodCategory(foodCategoryDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing foodCategory by foodCategoryId
    const existingFoodCategory = await FoodCategoryModel.findOne({ _id: foodCategoryId });
    if (!existingFoodCategory) {
      return res.status(404).json({ message: "FoodCategory not found" });
    }

    // Update foodCategory fields
    Object.assign(existingFoodCategory, foodCategoryDataToUpdate);
    const updatedFoodCategory = await existingFoodCategory.save();

    // Send the updated foodCategory as JSON response
    res.status(200).json({ message: "FoodCategory updated successfully", foodCategory: updatedFoodCategory });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete FoodCategory
export async function deleteFoodCategory(req, res, next) {
  try {
    const foodCategoryId = req.params.id;
    const updatedFoodCategory = await FoodCategoryModel.findOneAndUpdate(
      { _id: foodCategoryId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedFoodCategory) {
      return res.status(404).json({ message: "FoodCategory not found." });
    }

    res.status(200).json({ message: "FoodCategory deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

//Search foodCategory
export async function searchFoodCategory(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query params
    const searchRegex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex pattern for searching

    // Find foodCategorys that match any field using the regex pattern
    const foodCategorys = await FoodCategoryModel.find({
      $or: [
        { foodCategoryName: searchRegex }
      ],
    });

    if (!foodCategorys || foodCategorys.length === 0) {
      return res.status(404).json({ message: "No foodCategorys found" });
    }

    res.status(200).json({ foodCategorys });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}
