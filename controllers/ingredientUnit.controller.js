import IngredientUnitModel from "../models/ingredientUnit.model.js";
import { validateCreateIngredientUnit, validateUpdateIngredientUnit } from '../validators/ingredientUnit.validator.js';

// IngredientUnit New
export async function insertIngredientUnit(req, res) {
  try {
      const ingredientUnitData = req.body;
      console.log("ingredientUnitData", ingredientUnitData);

      // Validate ingredientUnit data before insertion
      const { error } = validateCreateIngredientUnit(ingredientUnitData);
      if (error) {
          return res.status(400).json({ error: error.message });
      }

      // Insert ingredientUnit with itemId
      const newIngredientUnit = new IngredientUnitModel(ingredientUnitData);
      const savedIngredientUnit = await newIngredientUnit.save();

      // Send Response
      res.status(200).json({ message: "IngredientUnit data inserted", datashow: savedIngredientUnit });
  } catch (error) {
      return res
          .status(500)
          .json({
              success: false,
              message: error.message || "Something went wrong",
          });
  }
}

// IngredientUnit List
export async function showAllIngredientUnits(req, res) {
  try {
    const ingredientUnit = await IngredientUnitModel.find({ is_active: "true" }).select('-password');

    if (!ingredientUnit || ingredientUnit.length === 0) {
      console.log("IngredientUnit not found");
      return res.status(404).json({ message: "IngredientUnit not found" });
    }

    res.status(200).json({ ingredientUnit });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single IngredientUnit
export async function showIngredientUnit(req, res) {
  try {
    const ingredientUnitId = req.params.id; // Corrected variable name
    const ingredientUnit = await IngredientUnitModel.findOne({ _id: ingredientUnitId }); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const ingredientUnit = await IngredientUnitModel.find({ _id: id }); // Corrected field name
    console.log(ingredientUnit);

    if (!ingredientUnit) {
      return res.status(404).json({ message: "IngredientUnit not found" });
    }

    res.status(200).json({ ingredientUnit });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update IngredientUnit
export async function updateIngredientUnit(req, res) {
  try {
    const ingredientUnitId = req.params.id;
    const ingredientUnitDataToUpdate = req.body;

    // Validate ingredientUnit data before update
    const { error } = validateUpdateIngredientUnit(ingredientUnitDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing ingredientUnit by ingredientUnitId
    const existingIngredientUnit = await IngredientUnitModel.findOne({ _id: ingredientUnitId });
    if (!existingIngredientUnit) {
      return res.status(404).json({ message: "IngredientUnit not found" });
    }

    // Update ingredientUnit fields
    Object.assign(existingIngredientUnit, ingredientUnitDataToUpdate);
    const updatedIngredientUnit = await existingIngredientUnit.save();

    // Send the updated ingredientUnit as JSON response
    res.status(200).json({ message: "IngredientUnit updated successfully", ingredientUnit: updatedIngredientUnit });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete IngredientUnit
export async function deleteIngredientUnit(req, res, next) {
  try {
    const ingredientUnitId = req.params.id;
    const updatedIngredientUnit = await IngredientUnitModel.findOneAndUpdate(
      { _id: ingredientUnitId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedIngredientUnit) {
      return res.status(404).json({ message: "IngredientUnit not found." });
    }

    res.status(200).json({ message: "IngredientUnit deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

//Search ingredientUnit
export async function searchIngredientUnit(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query params
    const searchRegex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex pattern for searching

    // Find ingredientUnits that match any field using the regex pattern
    const ingredientUnits = await IngredientUnitModel.find({
      $or: [
        { ingredientUnitName: searchRegex }
      ],
    });

    if (!ingredientUnits || ingredientUnits.length === 0) {
      return res.status(404).json({ message: "No ingredientUnits found" });
    }

    res.status(200).json({ ingredientUnits });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}
