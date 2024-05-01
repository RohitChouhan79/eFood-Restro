import FoodMenuModel from "../models/foodMenu.model.js";
import FoodCategoryModel from "../models/foodCategory.model.js";
import CuisineModel from "../models/cuisine.model.js";
import IngredientUnitModel from "../models/ingredientUnit.model.js";
import VeriationModel from "../models/veriation.model.js";
import { validateCreateFoodMenu, validateUpdateFoodMenu } from '../validators/foodMenu.validator.js';

// FoodMenu New
export async function insertFoodMenu(req, res) {
  try {
    const foodMenuData = req.body;

    // Generate foodMenuNameCode based on foodMenuName
    const foodMenuName = foodMenuData.foodMenuName;
    const foodMenuNameCode = generateFoodMenuNameCode(foodMenuName);

    // Add generated foodMenuNameCode to the foodMenuData
    foodMenuData.foodMenuNameCode = foodMenuNameCode;

    // Validate foodMenu data before insertion
    const { error } = validateCreateFoodMenu(foodMenuData);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Check if subCategoryId is active
    const foodCategory = await FoodCategoryModel.findById(foodMenuData.subCategoryId);
    if (!foodCategory || !foodCategory.is_active) {
      return res.status(400).json({ error: "FoodCategory is not active" });
    }

    // Check if cuisineId is active
    const cuisine = await CuisineModel.findById(foodMenuData.cuisineId);
    if (!cuisine || !cuisine.is_active) {
      return res.status(400).json({ error: "Cuisine is not active" });
    }

    // Check if ingredientConsumptionId is active
    const ingredientUnit = await IngredientUnitModel.findById(foodMenuData.ingredientConsumptionId);
    if (!ingredientUnit || !ingredientUnit.is_active) {
      return res.status(400).json({ error: "IngredientUnit is not active" });
    }

    // Check if veriationId is active
    const veriation = await VeriationModel.findById(foodMenuData.veriationId);
    if (!veriation || !veriation.is_active) {
      return res.status(400).json({ error: "Veriation is not active" });
    }

    // Check if foodMenuName already exists
    const existingFoodMenu = await FoodMenuModel.findOne({ foodMenuName });
    if (existingFoodMenu) {
      return res.status(400).json({ error: "FoodMenu with the given foodMenuName already exists" });
    }

    // Insert foodMenu with generated foodMenuNameCode
    const newFoodMenu = new FoodMenuModel(foodMenuData);
    const savedFoodMenu = await newFoodMenu.save();

    // Update cuisineschema with new FoodMenu reference
    cuisine.foodMenuId.push(savedFoodMenu._id);
    await cuisine.save();

    // Update foodCategoryschema with new FoodMenu reference
    foodCategory.foodMenuId.push(savedFoodMenu._id);
    await foodCategory.save();

    // Update ingredientUnitschema with new FoodMenu reference
    ingredientUnit.foodMenuId.push(savedFoodMenu._id);
    await ingredientUnit.save();

    // Update veriationschema with new FoodMenu reference
    veriation.foodMenuId.push(savedFoodMenu._id);
    await veriation.save();

    // Send Response
    res.status(200).json({ message: "FoodMenu data inserted", datashow: savedFoodMenu });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Something went wrong" });
  }
}

// Function to generate foodMenuNameCode
function generateFoodMenuNameCode(foodMenuName) {
  // Take the first three letters and convert to uppercase
  const letters = foodMenuName.slice(0, 3).toUpperCase();
  // Append '-01' as a default suffix
  return letters + '-01';
}


// FoodMenu List
export async function showAllFoodMenus(req, res) {
  try {
    const foodMenu = await FoodMenuModel.find({ is_active: "true" }).select('-password')
      .populate('cuisineId')
      .populate('subCategoryId')
      .populate('ingredientConsumptionId')
      .populate('veriationId')
      .populate('deliveryPriceId');

    if (!foodMenu || foodMenu.length === 0) {
      console.log("FoodMenu not found");
      return res.status(404).json({ message: "FoodMenu not found" });
    }

    res.status(200).json({ foodMenu });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single FoodMenu
export async function showFoodMenu(req, res) {
  try {
    const foodMenuId = req.params.id; // Corrected variable name
    const foodMenu = await FoodMenuModel.findOne({ _id: foodMenuId })
      .populate('cuisineId')
      .populate('subCategoryId')
      .populate('ingredientConsumptionId')
      .populate('veriationId')
      .populate('deliveryPriceId'); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const foodMenu = await FoodMenuModel.find({ _id: id }); // Corrected field name
    console.log(foodMenu);

    if (!foodMenu) {
      return res.status(404).json({ message: "FoodMenu not found" });
    }

    res.status(200).json({ foodMenu });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update FoodMenu
export async function updateFoodMenu(req, res) {
  try {
    const foodMenuId = req.params.id;
    const foodMenuDataToUpdate = req.body;

    // Validate foodMenu data before update
    const { error } = validateUpdateFoodMenu(foodMenuDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing foodMenu by foodMenuId
    const existingFoodMenu = await FoodMenuModel.findOne({ _id: foodMenuId });
    if (!existingFoodMenu) {
      return res.status(404).json({ message: "FoodMenu not found" });
    }

    // Update foodMenu fields
    Object.assign(existingFoodMenu, foodMenuDataToUpdate);
    const updatedFoodMenu = await existingFoodMenu.save();

    // Send the updated foodMenu as JSON response
    res.status(200).json({ message: "FoodMenu updated successfully", foodMenu: updatedFoodMenu });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete FoodMenu
export async function deleteFoodMenu(req, res, next) {
  try {
    const foodMenuId = req.params.id;
    const updatedFoodMenu = await FoodMenuModel.findOneAndUpdate(
      { _id: foodMenuId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedFoodMenu) {
      return res.status(404).json({ message: "FoodMenu not found." });
    }

    res.status(200).json({ message: "FoodMenu deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

//Search foodMenu
export async function searchFoodMenu(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query params
    const searchRegex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex pattern for searching

    // Find foodMenus that match any field using the regex pattern
    const foodMenus = await FoodMenuModel.find({
      $or: [
        { foodMenuName: searchRegex },
        { foodMenuNameCode: searchRegex },
        { isbeverages: searchRegex },
      ],
    });

    if (!foodMenus || foodMenus.length === 0) {
      return res.status(404).json({ message: "No foodMenus found" });
    }

    res.status(200).json({ foodMenus });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}
