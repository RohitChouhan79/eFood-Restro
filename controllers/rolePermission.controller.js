import RolePermissionModel from "../models/rolePermission.model.js";
import { validateCreateRolePermission, validateUpdateRolePermission } from '../validators/rolePermission.validator.js';


// RolePermission New
export async function insertRolePermission(req, res) {
  try {
      const rolePermissionData = req.body;
      console.log("rolePermissionData", rolePermissionData);

      // Validate rolePermission data before insertion
      const { error } = validateCreateRolePermission(rolePermissionData);
      if (error) {
          return res.status(400).json({ error: error.message });
      }

      // Check if roleName already exists in RolePermissionModel
      const existingRolePermission = await RolePermissionModel.findOne({
        roleName: rolePermissionData.roleName,
      });
      if (existingRolePermission) {
        return res
          .status(400)
          .json({ error: "RolePermission with the given roleName already exists" });
      }

      // Insert rolePermission with itemId
      const newRolePermission = new RolePermissionModel(rolePermissionData);
      const savedRolePermission = await newRolePermission.save();

      // Send Response
      res.status(200).json({ message: "RolePermission data inserted", datashow: savedRolePermission });
  } catch (error) {
      return res
          .status(500)
          .json({
              success: false,
              message: error.message || "Something went wrong",
          });
  }
}

// RolePermission List
export async function showAllRolePermissions(req, res) {
  try {
    const rolePermission = await RolePermissionModel.find({ is_active: "true" });

    if (!rolePermission || rolePermission.length === 0) {
      console.log("RolePermission not found");
      return res.status(404).json({ message: "RolePermission not found" });
    }

    res.status(200).json({ rolePermission });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single RolePermission
export async function showRolePermission(req, res) {
  try {
    const rolePermissionId = req.params.id; // Corrected variable name
    const rolePermission = await RolePermissionModel.findOne({ _id: rolePermissionId }); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const rolePermission = await RolePermissionModel.find({ _id: id }); // Corrected field name
    console.log(rolePermission);

    if (!rolePermission) {
      return res.status(404).json({ message: "RolePermission not found" });
    }

    res.status(200).json({ rolePermission });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update RolePermission
export async function updateRolePermission(req, res) {
  try {
    const rolePermissionId = req.params.id;
    const rolePermissionDataToUpdate = req.body;

    // Validate rolePermission data before update
    const { error } = validateUpdateRolePermission(rolePermissionDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing rolePermission by rolePermissionId
    const existingRolePermission = await RolePermissionModel.findOne({ _id: rolePermissionId });
    if (!existingRolePermission) {
      return res.status(404).json({ message: "RolePermission not found" });
    }

    // Update rolePermission fields
    Object.assign(existingRolePermission, rolePermissionDataToUpdate);
    const updatedRolePermission = await existingRolePermission.save();

    // Send the updated rolePermission as JSON response
    res.status(200).json({ message: "RolePermission updated successfully", rolePermission: updatedRolePermission });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete RolePermission
export async function deleteRolePermission(req, res, next) {
  try {
    const rolePermissionId = req.params.id;
    const updatedRolePermission = await RolePermissionModel.findOneAndUpdate(
      { _id: rolePermissionId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedRolePermission) {
      return res.status(404).json({ message: "RolePermission not found." });
    }

    res.status(200).json({ message: "RolePermission deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

//Search rolePermission
export async function searchWaiter(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query params
    const searchRegex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex pattern for searching

    // Find rolePermissions that match any field using the regex pattern
    const rolePermissions = await WaiterModel.find({
      $or: [
        { roleName: searchRegex }
      ],
    });

    if (!rolePermissions || rolePermissions.length === 0) {
      return res.status(404).json({ message: "No rolePermissions found" });
    }

    res.status(200).json({ rolePermissions });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}
