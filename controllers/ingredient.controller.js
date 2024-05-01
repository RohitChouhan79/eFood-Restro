import IngredientModel from "../models/ingredient.model.js";
import IngredientCategoryModel from "../models/ingredientCategory.model.js"; // Import the IngredientCategory model
import IngredientUnitModel from "../models/ingredientUnit.model.js"; // Import IngredientUnitModel
import SupplierModel from "../models/supplier.model.js"; // Import IngredientUnitModel
import { validateCreateIngredient, validateUpdateIngredient } from '../validators/ingredient.validator.js';

// Ingredient New
export async function insertIngredient(req, res) {
  try {
    const ingredientData = req.body;
    console.log("ingredientData", ingredientData);

    // Validate ingredient data before insertion
    const { error } = validateCreateIngredient(ingredientData);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Check if ingredientCategoryId is active
    const ingredientCategory = await IngredientCategoryModel.findById(ingredientData.ingredientCategoryId);
    if (!ingredientCategory || !ingredientCategory.is_active) {
      return res.status(400).json({ error: "IngredientCategory is not active" });
    }

    // Check if consumptionUnitId is active
    const ingredientUnit = await IngredientUnitModel.findById(ingredientData.consumptionUnitId);
    if (!ingredientUnit || !ingredientUnit.is_active) {
      return res.status(400).json({ error: "IngredientUnit is not active" });
    }

    // Check if supplierId is active
    const supplier = await SupplierModel.findById(ingredientData.supplierId);
    if (!supplier || !supplier.is_active) {
      return res.status(400).json({ error: "Supplier is not active" });
    }

    // Check if ingredientName already exists in IngredientModel
    const existingIngredient = await IngredientModel.findOne({
      ingredientName: ingredientData.ingredientName,
    });
    if (existingIngredient) {
      return res
        .status(400)
        .json({ error: "Ingredient with the given ingredientName already exists" });
    }

    // Generate ingredientCode based on ingredientName
    const existingIngredientsWithSameName = await IngredientModel.find({
      ingredientName: ingredientData.ingredientName,
    });
    const ingredientCount = existingIngredientsWithSameName.length + 1;
    const paddedCount = ingredientCount.toString().padStart(2, "0");
    const ingredientCode = ingredientData.ingredientName.substring(0, 3).toUpperCase() + "-" + paddedCount;

    // Insert Ingredient with ingredientId
    const newIngredient = new IngredientModel({
      ...ingredientData,
      ingredientCode: ingredientCode
    });
    const savedIngredient = await newIngredient.save();

    // Update IngredientCategory with new Ingredient reference
    ingredientCategory.ingredientId.push(savedIngredient._id);
    await ingredientCategory.save();

    // Update IngredientUnit with new Ingredient reference
    ingredientUnit.ingredientId.push(savedIngredient._id);
    await ingredientUnit.save();

    // Send Response
    res.status(200).json({
      message: "Ingredient data inserted",
      ingredientData: savedIngredient,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}


// Ingredient List
export async function showAllIngredientes(req, res) {
  try {
    const ingredient = await IngredientModel.find({ is_active: "true" }).select('-password').select('-password');

    if (!ingredient || ingredient.length === 0) {
      console.log("Ingredient not found");
      return res.status(404).json({ message: "Ingredient not found" });
    }

    res.status(200).json({ ingredient });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single Ingredient
export async function showIngredient(req, res) {
  try {
    const ingredientId = req.params.id; // Corrected variable name
    const ingredient = await IngredientModel.findOne({ _id: ingredientId })
    .populate('ingredientCategoryId')
    .populate('consumptionUnitId');
    
    console.log(ingredient);

    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    res.status(200).json({ ingredient });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update Ingredient
export async function updateIngredient(req, res) {
  try {
    const ingredientId = req.params.id;
    const ingredientDataToUpdate = req.body;

    // Validate ingredient data before update
    const { error } = validateUpdateIngredient(ingredientDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing ingredient by ingredientId
    const existingIngredient = await IngredientModel.findOne({ _id: ingredientId });
    if (!existingIngredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    // Update ingredient fields
    Object.assign(existingIngredient, ingredientDataToUpdate);
    const updatedIngredient = await existingIngredient.save();

    // Send the updated ingredient as JSON response
    res.status(200).json({ message: "Ingredient updated successfully", ingredient: updatedIngredient });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete Ingredient
export async function deleteIngredient(req, res, next) {
  try {
    const ingredientId = req.params.id;
    const updatedIngredient = await IngredientModel.findOneAndUpdate(
      { _id: ingredientId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedIngredient) {
      return res.status(404).json({ message: "Ingredient not found." });
    }

    res.status(200).json({ message: "Ingredient deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

//Search ingredient
export async function searchIngredient(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query params
    const searchRegex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex pattern for searching
    console.log("searchRegex", searchRegex);

    // Find ingredientes that match any field using the regex pattern
    const ingredientes = await IngredientModel.find({
      $or: [
        { ingredientName: searchRegex },
        { ingredientCode: searchRegex }
      ],
    });
    console.log("ingredientes", ingredientes);

    if (!ingredientes || ingredientes.length === 0) {
      return res.status(404).json({ message: "No ingredientes found" });
    }

    res.status(200).json({ ingredientes });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}
