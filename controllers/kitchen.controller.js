import KitchenModel from "../models/kitchen.model.js";
import BranchModel from "../models/branch.model.js";
import FloorModel from "../models/floor.model.js";
import { validateCreateKitchen, validateUpdateKitchen } from '../validators/kitchen.validator.js';

// export async function insertKitchen(req, res) {
//   try {
//     const kitchenData = req.body;

//     // Validate kitchen data before insertion
//     const { error } = validateCreateKitchen(kitchenData);
//     if (error) {
//       return res.status(400).json({ error: error.message });
//     }

//     // Check if kitchenId is active
//     const kitchen = await KitchenModel.findById(kitchenData.kitchenId);
//     if (!kitchen || !kitchen.is_active) {
//       return res.status(400).json({ error: "Kitchen is not active" });
//     }

//     // Find the last kitchen in the kitchen to calculate the next kitchen number
//     const lastKitchen = await KitchenModel.findOne({ kitchenId: kitchenData.kitchenId }).sort({ kitchenNumber: -1 });
//     let nextKitchenNumber = 0; // Initialize to 0
//     if (lastKitchen) {
//       nextKitchenNumber = lastKitchen.kitchenNumber + 1;
//     }

//     // Assign the calculated kitchenNumber to the kitchenData
//     kitchenData.kitchenNumber = nextKitchenNumber;

//     // Insert kitchen with itemId
//     const newKitchen = new KitchenModel(kitchenData);
//     const savedKitchen = await newKitchen.save();

//     // Send Response
//     res.status(200).json({ message: "Kitchen data inserted", datashow: savedKitchen });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Something went wrong",
//     });
//   }
// }
// Kitchen New
export async function insertKitchen(req, res) {
  try {
    const kitchenData = req.body;

    // Validate kitchen data before insertion
    const { error } = validateCreateKitchen(kitchenData);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Check if branchId is active
    const branch = await BranchModel.findById(kitchenData.branchId);
    if (!branch || !branch.is_active) {
      return res.status(400).json({ error: "Branch is not active" });
    }

    // Check if kitchenArea is active
    const floor = await FloorModel.findById(kitchenData.kitchenArea);
    if (!floor || !floor.is_active) {
      return res.status(400).json({ error: "Floor is not active" });
    }

    // Generate kitchenCode based on kitchenName
    const existingKitchenesWithSameName = await KitchenModel.find({
      kitchenName: kitchenData.kitchenName,
    });
    const kitchenCount = existingKitchenesWithSameName.length + 1;
    const paddedCount = kitchenCount.toString().padStart(2, "0");
    const kitchenCode = kitchenData.kitchenName.substring(0, 3).toUpperCase() + "-" + paddedCount;

    // Insert Kitchen with kitchenId
    const newKitchen = new KitchenModel({
      ...kitchenData,
      kitchenCode: kitchenCode
    });
    const savedKitchen = await newKitchen.save();

    // Send Response
    res.status(200).json({
      message: "Kitchen data inserted",
      kitchenData: savedKitchen,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}
// Kitchen List
export async function showAllKitchens(req, res) {
  try {
    const kitchen = await KitchenModel.find({ is_active: "true" }).select('-password');

    if (!kitchen || kitchen.length === 0) {
      console.log("Kitchen not found");
      return res.status(404).json({ message: "Kitchen not found" });
    }

    res.status(200).json({ kitchen });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single Kitchen
export async function showKitchen(req, res) {
  try {
    const kitchenId = req.params.id; // Corrected variable name
    const kitchen = await KitchenModel.findOne({ _id: kitchenId }); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const kitchen = await KitchenModel.find({ _id: id }); // Corrected field name
    console.log(kitchen);

    if (!kitchen) {
      return res.status(404).json({ message: "Kitchen not found" });
    }

    res.status(200).json({ kitchen });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update Kitchen
export async function updateKitchen(req, res) {
  try {
    const kitchenId = req.params.id;
    const kitchenDataToUpdate = req.body;

    // Validate kitchen data before update
    const { error } = validateUpdateKitchen(kitchenDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing kitchen by kitchenId
    const existingKitchen = await KitchenModel.findOne({ _id: kitchenId });
    if (!existingKitchen) {
      return res.status(404).json({ message: "Kitchen not found" });
    }

    // Update kitchen fields
    Object.assign(existingKitchen, kitchenDataToUpdate);
    const updatedKitchen = await existingKitchen.save();

    // Send the updated kitchen as JSON response
    res.status(200).json({ message: "Kitchen updated successfully", kitchen: updatedKitchen });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete Kitchen
export async function deleteKitchen(req, res, next) {
  try {
    const kitchenId = req.params.id;
    const updatedKitchen = await KitchenModel.findOneAndUpdate(
      { _id: kitchenId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedKitchen) {
      return res.status(404).json({ message: "Kitchen not found." });
    }

    res.status(200).json({ message: "Kitchen deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}
