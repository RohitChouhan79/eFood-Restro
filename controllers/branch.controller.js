import BranchModel from "../models/branch.model.js";
import CompanyModel from "../models/company.model.js"; // Import the Company model
import AreaModel from "../models/area.model.js"; // Import AreaModel
import DeliveryPartnerModel from "../models/deliveryPartner.model.js"; // Import AreaModel
import { validateCreateBranch, validateUpdateBranch } from '../validators/branch.validator.js';
import bcrypt from "bcrypt";

// Branch New
export async function insertBranch(req, res) {
  try {
    const branchData = req.body;

    // Validate branch data before insertion
    const { error } = validateCreateBranch(branchData);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Check if companyId is active
    const company = await CompanyModel.findById(branchData.companyId);
    if (!company || !company.is_active) {
      return res.status(400).json({ error: "Company is not active" });
    }

    // Check if areaId is active
    const area = await AreaModel.findById(branchData.areaId);
    if (!area || !area.is_active) {
      return res.status(400).json({ error: "Area is not active" });
    }

    // Check if emailAddress already exists in BranchModel
    const existingBranch = await BranchModel.findOne({
      emailAddress: branchData.emailAddress,
    });
    if (existingBranch) {
      return res
        .status(400)
        .json({ error: "Branch with the given emailAddress already exists" });
    }

    // Generate branchCode based on branchName
    const existingBranchesWithSameName = await BranchModel.find({
      branchName: branchData.branchName,
    });
    const branchCount = existingBranchesWithSameName.length + 1;
    const paddedCount = branchCount.toString().padStart(2, "0");
    const branchCode = branchData.branchName.substring(0, 3).toUpperCase() + "-" + paddedCount;

    // Replace the plain password with the hashed one
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(branchData.password, saltRounds);

    // Insert Branch with branchId
    const newBranch = new BranchModel({
      ...branchData,
      branchCode: branchCode,
      password: hashedPassword,
    });
    const savedBranch = await newBranch.save();

    // Send Response
    res.status(200).json({
      message: "Branch data inserted",
      branchData: savedBranch,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}

// Branch List
export async function showAllBranches(req, res) {
  try {
    const branch = await BranchModel.find().select('-password');

    if (!branch || branch.length === 0) {
      console.log("Branch not found");
      return res.status(404).json({ message: "Branch not found" });
    }

    res.status(200).json({ branch });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single Branch
export async function showBranch(req, res) {
  try {
    const branchId = req.params.id; // Corrected variable name
    const branch = await BranchModel.findOne({ _id: branchId })
    .select('-password')
    .populate({ path: 'companyId', select: '-password' })
    .populate('areaId');
    
    console.log(branch);

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.status(200).json({ branch });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update Branch
export async function updateBranch(req, res) {
  try {
    const branchId = req.params.id;
    const branchDataToUpdate = req.body;

    // Validate branch data before update
    const { error } = validateUpdateBranch(branchDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing branch by branchId
    const existingBranch = await BranchModel.findOne({ _id: branchId });
    if (!existingBranch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    // Update branch fields
    Object.assign(existingBranch, branchDataToUpdate);
    const updatedBranch = await existingBranch.save();

    // Send the updated branch as JSON response
    res.status(200).json({ message: "Branch updated successfully", branch: updatedBranch });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete Branch
export async function deleteBranch(req, res, next) {
  try {
    const branchId = req.params.id;
    const deleteBranch = await BranchModel.findOneAndDelete(
      { _id: branchId },
      { new: true }
    );

    if (!deleteBranch) {
      return res.status(404).json({ message: "Branch not found." });
    }

    res.status(200).json({ message: "Branch deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Is_Active Branch
export async function is_activeBranch(req, res, next) {
  try {
    const branchId = req.params.id;
    const updatedBranch = await BranchModel.findOneAndUpdate(
      { _id: branchId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedBranch) {
      return res.status(404).json({ message: "Branch not found." });
    }

    res.status(200).json({ message: "Branch deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

//Search branch
export async function searchBranch(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query params
    const searchRegex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex pattern for searching

    // Find branches that match any field using the regex pattern
    const branches = await BranchModel.find({
      $or: [
        { branchName: searchRegex },
        { branchCode: searchRegex },
        { 'address.streetName': searchRegex },
        { 'address.landMark': searchRegex },
        { 'address.city': searchRegex },
        { 'address.pinCode': searchRegex },
        { 'address.state': searchRegex },
        { 'address.country': searchRegex },
        { emailAddress: searchRegex },
        { ownerName: searchRegex },
        { branchType: searchRegex },
      ],
    });

    if (!branches || branches.length === 0) {
      return res.status(404).json({ message: "No branches found" });
    }

    res.status(200).json({ branches });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// Update requestStatus of Deliveryman
export async function updateDeliverymanRequestStatus(req, res) {
  try {
    const { branchId, deliveryPartnerId } = req.params;
    const { requestStatus } = req.body;

    // Check if branch exists
    const branch = await BranchModel.findById(branchId);
    if (!branch) {
      return res.status(404).json({ error: "Branch not found" });
    }

    // Check if DeliveryPartner exists
    const deliveryPartner = await DeliveryPartnerModel.findById(deliveryPartnerId);
    if (!deliveryPartner) {
      return res.status(404).json({ error: "DeliveryPartner not found" });
    }

    // Update requestStatus in Branch
    const deliverymanIndex = branch.Deliveryman.findIndex(dm => dm.deliveryPartnerId.equals(deliveryPartnerId));
    if (deliverymanIndex !== -1) {
      branch.Deliveryman[deliverymanIndex].requestStatus = requestStatus;
      await branch.save();
    }

    // Update requestStatus in DeliveryPartner
    deliveryPartner.requestStatus = requestStatus;
    await deliveryPartner.save();

    return res.status(200).json({ message: "Deliveryman request status updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Something went wrong" });
  }
}