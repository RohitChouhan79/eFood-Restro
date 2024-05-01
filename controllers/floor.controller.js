import FloorModel from "../models/floor.model.js";
import BranchModel from "../models/branch.model.js";
import { validateCreateFloor, validateUpdateFloor } from '../validators/floor.validator.js';

// Floor New
// export async function insertFloor(req, res) {
//   try {
//       const floorData = req.body;

//       // Validate floor data before insertion
//       const { error } = validateCreateFloor(floorData);
//       if (error) {
//           return res.status(400).json({ error: error.message });
//       }

//       // Check if branchId is active
//       const branch = await BranchModel.findById(chefData.branchId);
//       if (!branch || !branch.is_active) {
//         return res.status(400).json({ error: "Branch is not active" });
//       }

//       // Find the last floor in the branch to calculate the next floor number
//       const lastFloor = await FloorModel.findOne({ branchId: floorData.branchId })
//         .sort({ floorNumber: -1 }); // Sort in descending order to get the last floor
//       let nextFloorNumber = 1;
//       if (lastFloor) {
//         nextFloorNumber = lastFloor.floorNumber + 1;
//       }

//       // Assign the calculated floorNumber to the floorData
//       floorData.floorNumber = nextFloorNumber;

//       // Insert floor with itemId
//       const newFloor = new FloorModel(floorData);
//       const savedFloor = await newFloor.save();

//       // Send Response
//       res.status(200).json({ message: "Floor data inserted", datashow: savedFloor });
//   } catch (error) {
//       return res.status(500).json({
//           success: false,
//           message: error.message || "Something went wrong",
//       });
//   }
// }
export async function insertFloor(req, res) {
  try {
    const floorData = req.body;

    // Validate floor data before insertion
    const { error } = validateCreateFloor(floorData);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Check if branchId is active
    const branch = await BranchModel.findById(floorData.branchId);
    if (!branch || !branch.is_active) {
      return res.status(400).json({ error: "Branch is not active" });
    }

    // Find the last floor in the branch to calculate the next floor number
    const lastFloor = await FloorModel.findOne({ branchId: floorData.branchId }).sort({ floorNumber: -1 });
    let nextFloorNumber = 0; // Initialize to 0
    if (lastFloor) {
      nextFloorNumber = lastFloor.floorNumber + 1;
    }

    // Assign the calculated floorNumber to the floorData
    floorData.floorNumber = nextFloorNumber;

    // Insert floor with itemId
    const newFloor = new FloorModel(floorData);
    const savedFloor = await newFloor.save();

    // Send Response
    res.status(200).json({ message: "Floor data inserted", datashow: savedFloor });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Floor List
export async function showAllFloors(req, res) {
  try {
    const floor = await FloorModel.find({ is_active: "true" }).select('-password');

    if (!floor || floor.length === 0) {
      console.log("Floor not found");
      return res.status(404).json({ message: "Floor not found" });
    }

    res.status(200).json({ floor });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single Floor
export async function showFloor(req, res) {
  try {
    const floorId = req.params.id; // Corrected variable name
    const floor = await FloorModel.findOne({ _id: floorId }); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const floor = await FloorModel.find({ _id: id }); // Corrected field name
    console.log(floor);

    if (!floor) {
      return res.status(404).json({ message: "Floor not found" });
    }

    res.status(200).json({ floor });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update Floor
export async function updateFloor(req, res) {
  try {
    const floorId = req.params.id;
    const floorDataToUpdate = req.body;

    // Validate floor data before update
    const { error } = validateUpdateFloor(floorDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing floor by floorId
    const existingFloor = await FloorModel.findOne({ _id: floorId });
    if (!existingFloor) {
      return res.status(404).json({ message: "Floor not found" });
    }

    // Update floor fields
    Object.assign(existingFloor, floorDataToUpdate);
    const updatedFloor = await existingFloor.save();

    // Send the updated floor as JSON response
    res.status(200).json({ message: "Floor updated successfully", floor: updatedFloor });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete Floor
export async function deleteFloor(req, res, next) {
  try {
    const floorId = req.params.id;
    const updatedFloor = await FloorModel.findOneAndUpdate(
      { _id: floorId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedFloor) {
      return res.status(404).json({ message: "Floor not found." });
    }

    res.status(200).json({ message: "Floor deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}
