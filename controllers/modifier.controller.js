import ModifierModel from "../models/modifier.model.js";
import IngredientModel from "../models/ingredient.model.js";
import { validateCreateModifier, validateUpdateModifier } from '../validators/modifier.validator.js';

// Modifier New
export async function insertModifier(req, res) {
  try {
      const modifierData = req.body;

      // Validate modifier data before insertion
      const { error } = validateCreateModifier(modifierData);
      if (error) {
          return res.status(400).json({ error: error.message });
      }

      // Check if ingredientConsumption is active
      const ingredient = await IngredientModel.findById(modifierData.ingredientConsumption);
      if (!ingredient || !ingredient.is_active) {
        return res.status(400).json({ error: "Ingredient is not active" });
      }

      // Insert modifier with itemId
      const newModifier = new ModifierModel(modifierData);
      const savedModifier = await newModifier.save();

      // Send Response
      res.status(200).json({ message: "Modifier data inserted", datashow: savedModifier });
  } catch (error) {
      return res
          .status(500)
          .json({
              success: false,
              message: error.message || "Something went wrong",
          });
  }
}

// Modifier List
export async function showAllModifiers(req, res) {
  try {
    const modifier = await ModifierModel.find({ is_active: "true" }).select('-password');

    if (!modifier || modifier.length === 0) {
      console.log("Modifier not found");
      return res.status(404).json({ message: "Modifier not found" });
    }

    res.status(200).json({ modifier });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single Modifier
export async function showModifier(req, res) {
  try {
    const modifierId = req.params.id; // Corrected variable name
    const modifier = await ModifierModel.findOne({ _id: modifierId }); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const modifier = await ModifierModel.find({ _id: id }); // Corrected field name
    console.log(modifier);

    if (!modifier) {
      return res.status(404).json({ message: "Modifier not found" });
    }

    res.status(200).json({ modifier });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update Modifier
export async function updateModifier(req, res) {
  try {
    const modifierId = req.params.id;
    const modifierDataToUpdate = req.body;

    // Validate modifier data before update
    const { error } = validateUpdateModifier(modifierDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing modifier by modifierId
    const existingModifier = await ModifierModel.findOne({ _id: modifierId });
    if (!existingModifier) {
      return res.status(404).json({ message: "Modifier not found" });
    }

    // Update modifier fields
    Object.assign(existingModifier, modifierDataToUpdate);
    const updatedModifier = await existingModifier.save();

    // Send the updated modifier as JSON response
    res.status(200).json({ message: "Modifier updated successfully", modifier: updatedModifier });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete Modifier
export async function deleteModifier(req, res, next) {
  try {
    const modifierId = req.params.id;
    const updatedModifier = await ModifierModel.findOneAndUpdate(
      { _id: modifierId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedModifier) {
      return res.status(404).json({ message: "Modifier not found." });
    }

    res.status(200).json({ message: "Modifier deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

//Search modifier
export async function searchModifier(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query params
    const searchRegex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex pattern for searching

    // Find modifieres that match any field using the regex pattern
    const modifieres = await ModifierModel.find({
      $or: [
        { modifierName: searchRegex }
      ],
    });

    if (!modifieres || modifieres.length === 0) {
      return res.status(404).json({ message: "No modifieres found" });
    }

    res.status(200).json({ modifieres });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}