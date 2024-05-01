import FoodComboModel from "../models/foodCombo.model.js";
import FoodCategoryModel from "../models/foodCategory.model.js";
import FoodMenuModel from "../models/foodMenu.model.js";
import DeliveryPartnerModel from "../models/deliveryPartner.model.js";
import BranchModel from "../models/branch.model.js";
import { validateCreateFoodCombo, validateUpdateFoodCombo } from '../validators/foodCombo.validator.js';

// FoodCombo New
export async function insertFoodCombo(req, res) {
  try {
    const foodComboData = req.body;

    // Generate foodComboNameCode based on foodComboName
    const foodComboName = foodComboData.foodComboName;
    const foodComboNameCode = generateFoodComboNameCode(foodComboName);


    // Add generated foodComboNameCode to the foodComboData
    foodComboData.foodComboNameCode = foodComboNameCode;

    // Validate foodCombo data before insertion
    const { error } = validateCreateFoodCombo(foodComboData);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Check if foodCategoryId is active
    const foodCategory = await FoodCategoryModel.findById(foodComboData.foodCategoryId);
    if (!foodCategory || !foodCategory.is_active) {
      return res.status(400).json({ error: "FoodCategory is not active" });
    }

    // Check if foodMenuId is active
    const foodMenu = await FoodMenuModel.findById(foodComboData.foodMenuId);
    if (!foodMenu || !foodMenu.is_active) {
      return res.status(400).json({ error: "FoodMenu is not active" });
    }

    // Check if deliveryPrice is active
    const deliveryPartner = await DeliveryPartnerModel.findById(foodComboData.deliveryPrice);
    if (!deliveryPartner || !deliveryPartner.is_active) {
      return res.status(400).json({ error: "Delivery Partner is not active" });
    }

    // Check if branchId is active
    const branch = await BranchModel.findById(foodComboData.branchId);
    if (!branch || !branch.is_active) {
      return res.status(400).json({ error: "Branch is not active" });
    }

    // Check if foodComboName already exists
    const existingFoodCombo = await FoodComboModel.findOne({ foodComboName });
    if (existingFoodCombo) {
      return res.status(400).json({ error: "FoodCombo with the given foodComboName already exists" });
    }

    // Insert foodCombo with generated foodComboNameCode
    const newFoodCombo = new FoodComboModel(foodComboData);
    const savedFoodCombo = await newFoodCombo.save();

    // Send Response
    res.status(200).json({ message: "FoodCombo data inserted", datashow: savedFoodCombo });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Something went wrong" });
  }
}

// Function to generate foodComboNameCode
function generateFoodComboNameCode(foodComboName) {
  // Take the first three letters and convert to uppercase
  const letters = foodComboName.slice(0, 3).toUpperCase();
  // Append '-01' as a default suffix
  return letters + '-01';
}


// FoodCombo List
export async function showAllFoodCombos(req, res) {
  try {
    const foodCombo = await FoodComboModel.find({ is_active: "true" }).select('-password');

    if (!foodCombo || foodCombo.length === 0) {
      console.log("FoodCombo not found");
      return res.status(404).json({ message: "FoodCombo not found" });
    }

    res.status(200).json({ foodCombo });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single FoodCombo
export async function showFoodCombo(req, res) {
  try {
    const foodComboId = req.params.id; // Corrected variable name
    const foodCombo = await FoodComboModel.findOne({ _id: foodComboId }); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const foodCombo = await FoodComboModel.find({ _id: id }); // Corrected field name
    console.log(foodCombo);

    if (!foodCombo) {
      return res.status(404).json({ message: "FoodCombo not found" });
    }

    res.status(200).json({ foodCombo });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update FoodCombo
export async function updateFoodCombo(req, res) {
  try {
    const foodComboId = req.params.id;
    const foodComboDataToUpdate = req.body;

    // Validate foodCombo data before update
    const { error } = validateUpdateFoodCombo(foodComboDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing foodCombo by foodComboId
    const existingFoodCombo = await FoodComboModel.findOne({ _id: foodComboId });
    if (!existingFoodCombo) {
      return res.status(404).json({ message: "FoodCombo not found" });
    }

    // Update foodCombo fields
    Object.assign(existingFoodCombo, foodComboDataToUpdate);
    const updatedFoodCombo = await existingFoodCombo.save();

    // Send the updated foodCombo as JSON response
    res.status(200).json({ message: "FoodCombo updated successfully", foodCombo: updatedFoodCombo });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete FoodCombo
export async function deleteFoodCombo(req, res, next) {
  try {
    const foodComboId = req.params.id;
    const updatedFoodCombo = await FoodComboModel.findOneAndUpdate(
      { _id: foodComboId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedFoodCombo) {
      return res.status(404).json({ message: "FoodCombo not found." });
    }

    res.status(200).json({ message: "FoodCombo deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

//Search foodCombo
export async function searchFoodCombo(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query params
    const searchRegex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex pattern for searching

    // Find foodCombos that match any field using the regex pattern
    const foodCombos = await FoodComboModel.find({
      $or: [
        { foodComboName: searchRegex },
        { foodComboNameCode: searchRegex }
      ],
    });

    if (!foodCombos || foodCombos.length === 0) {
      return res.status(404).json({ message: "No foodCombos found" });
    }

    res.status(200).json({ foodCombos });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}
