import ChefModel from "../models/chef.model.js";
import BranchModel from "../models/branch.model.js";
import { validateCreateChef, validateUpdateChef } from '../validators/chef.validator.js';
import bcrypt from "bcrypt";

// Chef New
export async function insertChef(req, res) {
  try {
    const chefData = req.body;
    console.log("chefData", chefData);

    // Validate chef data before insertion
    const { error } = validateCreateChef(chefData);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

        // Check if branchId is active
        const branch = await BranchModel.findById(chefData.branchId);
        if (!branch || !branch.is_active) {
          return res.status(400).json({ error: "Branch is not active" });
        }

    // Check if emailAddress already exists in ChefModel
    const existingChef = await ChefModel.findOne({
      emailAddress: chefData.emailAddress,
    });
    if (existingChef) {
      return res
        .status(400)
        .json({ error: "Chef with the given emailAddress already exists" });
    }

    // Replace the plain password with the hashed one
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(chefData.password, saltRounds);

    // Insert Chef with chefId
    const newChef = new ChefModel({
      ...chefData,
      password: hashedPassword,
    });
    const savedChef = await newChef.save();

    // Send Response
    res.status(200).json({
      message: "Chef data inserted",
      chefData: savedChef,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}

// Chef List
export async function showAllChefs(req, res) {
  try {
    const chef = await ChefModel.find().select('-password').populate('branchId');

    if (!chef || chef.length === 0) {
      console.log("Chef not found");
      return res.status(404).json({ message: "Chef not found" });
    }

    res.status(200).json({ chef });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single Chef
export async function showChef(req, res) {
  try {
    const chefId = req.params.id; // Corrected variable name
    const chef = await ChefModel.findOne({ _id: chefId })
      .select('-password')
      .populate({ path: 'branchId', select: '-password' })

    console.log(chef);

    if (!chef) {
      return res.status(404).json({ message: "Chef not found" });
    }

    res.status(200).json({ chef });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update Chef
export async function updateChef(req, res) {
  try {
    const chefId = req.params.id;
    const chefDataToUpdate = req.body;

    // Validate chef data before update
    const { error } = validateUpdateChef(chefDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing chef by chefId
    const existingChef = await ChefModel.findOne({ _id: chefId });
    if (!existingChef) {
      return res.status(404).json({ message: "Chef not found" });
    }

    // Update chef fields
    Object.assign(existingChef, chefDataToUpdate);
    const updatedChef = await existingChef.save();

    // Send the updated chef as JSON response
    res.status(200).json({ message: "Chef updated successfully", chef: updatedChef });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete Chef
export async function deleteChef(req, res, next) {
  try {
    const chefId = req.params.id;
    const deleteChef = await ChefModel.findOneAndDelete(
      { _id: chefId },
      { new: true }
    );

    if (!deleteChef) {
      return res.status(404).json({ message: "Chef not found." });
    }

    res.status(200).json({ message: "Chef deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Is_Active Chef
export async function is_activeChef(req, res, next) {
  try {
    const chefId = req.params.id;
    const updatedChef = await ChefModel.findOneAndUpdate(
      { _id: chefId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedChef) {
      return res.status(404).json({ message: "Chef not found." });
    }

    res.status(200).json({ message: "Chef deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

//Search chef
export async function searchChef(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query params
    const searchRegex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex pattern for searching

    // Find chefs that match any field using the regex pattern
    const chefs = await ChefModel.find({
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { emailAddress: searchRegex },
        { 'address.streetName': searchRegex },
        { 'address.landMark': searchRegex },
        { 'address.city': searchRegex },
        { 'address.pinCode': searchRegex },
        { 'address.state': searchRegex },
        { 'address.country': searchRegex }
      ],
    });

    if (!chefs || chefs.length === 0) {
      return res.status(404).json({ message: "No chefs found" });
    }

    res.status(200).json({ chefs });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}
