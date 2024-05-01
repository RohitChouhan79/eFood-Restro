import WaiterModel from "../models/waiter.model.js";
import BranchModel from "../models/branch.model.js";
import { validateCreateWaiter, validateUpdateWaiter } from '../validators/waiter.validator.js';
import bcrypt from "bcrypt";

// Waiter New
export async function insertWaiter(req, res) {
  try {
    const waiterData = req.body;
    console.log("waiterData", waiterData);

    // Validate waiter data before insertion
    const { error } = validateCreateWaiter(waiterData);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Check if branchId is active
    const branch = await BranchModel.findById(waiterData.branchId);
    if (!branch || !branch.is_active) {
      return res.status(400).json({ error: "Branch is not active" });
    }
    console.log("branch", branch);

    // Check if emailAddress already exists in WaiterModel
    const existingWaiter = await WaiterModel.findOne({
      emailAddress: waiterData.emailAddress,
    });
    if (existingWaiter) {
      return res
        .status(400)
        .json({ error: "Waiter with the given emailAddress already exists" });
    }

    // Replace the plain password with the hashed one
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(waiterData.password, saltRounds);

    // Insert Waiter with waiterId
    const newWaiter = new WaiterModel({
      ...waiterData,
      password: hashedPassword,
    });
    const savedWaiter = await newWaiter.save();

    // Send Response
    res.status(200).json({
      message: "Waiter data inserted",
      waiterData: savedWaiter,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}

// Waiter List
export async function showAllWaiters(req, res) {
  try {
    const waiter = await WaiterModel.find({ is_active: "true" }).select('-password');

    if (!waiter || waiter.length === 0) {
      console.log("Waiter not found");
      return res.status(404).json({ message: "Waiter not found" });
    }

    res.status(200).json({ waiter });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single Waiter
export async function showWaiter(req, res) {
  try {
    const waiterId = req.params.id; // Corrected variable name
    const waiter = await WaiterModel.findOne({ _id: waiterId })
      .select('-password')
      .populate({ path: 'branchId', select: '-password' })

    console.log(waiter);

    if (!waiter) {
      return res.status(404).json({ message: "Waiter not found" });
    }

    res.status(200).json({ waiter });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update Waiter
export async function updateWaiter(req, res) {
  try {
    const waiterId = req.params.id;
    const waiterDataToUpdate = req.body;

    // Validate waiter data before update
    const { error } = validateUpdateWaiter(waiterDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing waiter by waiterId
    const existingWaiter = await WaiterModel.findOne({ _id: waiterId });
    if (!existingWaiter) {
      return res.status(404).json({ message: "Waiter not found" });
    }

    // Update waiter fields
    Object.assign(existingWaiter, waiterDataToUpdate);
    const updatedWaiter = await existingWaiter.save();

    // Send the updated waiter as JSON response
    res.status(200).json({ message: "Waiter updated successfully", waiter: updatedWaiter });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete Waiter
export async function deleteWaiter(req, res, next) {
  try {
    const waiterId = req.params.id;
    const updatedWaiter = await WaiterModel.findOneAndDelete(
      { _id: waiterId },
      { new: true }
    );

    if (!updatedWaiter) {
      return res.status(404).json({ message: "Waiter not found." });
    }

    res.status(200).json({ message: "Waiter deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Is_Active Waiter
export async function is_activeWaiter(req, res, next) {
  try {
    const waiterId = req.params.id;
    const updatedWaiter = await WaiterModel.findOneAndUpdate(
      { _id: waiterId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedWaiter) {
      return res.status(404).json({ message: "Waiter not found." });
    }

    res.status(200).json({ message: "Waiter deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

//Search waiter
export async function searchWaiter(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query params
    const searchRegex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex pattern for searching

    // Find waiters that match any field using the regex pattern
    const waiters = await WaiterModel.find({
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

    if (!waiters || waiters.length === 0) {
      return res.status(404).json({ message: "No waiters found" });
    }

    res.status(200).json({ waiters });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}
