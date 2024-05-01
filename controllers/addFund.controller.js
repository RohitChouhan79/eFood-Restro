import AddFundModel from "../models/addFund.model.js";
import CustomerModel from "../models/customer.model.js";
import { validateCreateAddFund, validateUpdateAddFund } from '../validators/addFund.validator.js';

// AddFund New
export async function insertAddFund(req, res) {
  try {
    const addFundData = req.body;
    console.log("addFundData", addFundData);

    // Validate addFund data before insertion
    const { error } = validateCreateAddFund(addFundData);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Insert addFund with itemId
    const newAddFund = new AddFundModel(addFundData);
    const savedAddFund = await newAddFund.save();

    // Update customer's wallet
    const customerId = addFundData.customerId;
    const fundAmount = addFundData.fundAmount;
    await CustomerModel.findByIdAndUpdate(customerId, { $inc: { wallet: fundAmount } });

    // Send Response
    res.status(200).json({ message: "AddFund data inserted", datashow: savedAddFund });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: error.message || "Something went wrong",
      });
  }
}


// AddFund List
export async function showAllAddFunds(req, res) {
  try {
    const addFund = await AddFundModel.find({ is_active: "true" }).select('-password');

    if (!addFund || addFund.length === 0) {
      console.log("AddFund not found");
      return res.status(404).json({ message: "AddFund not found" });
    }

    res.status(200).json({ addFund });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single AddFund
export async function showAddFund(req, res) {
  try {
    const addFundId = req.params.id; // Corrected variable name
    const addFund = await AddFundModel.findOne({ _id: addFundId }); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const addFund = await AddFundModel.find({ _id: id }); // Corrected field name
    console.log(addFund);

    if (!addFund) {
      return res.status(404).json({ message: "AddFund not found" });
    }

    res.status(200).json({ addFund });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update AddFund
export async function updateAddFund(req, res) {
  try {
    const addFundId = req.params.id;
    const addFundDataToUpdate = req.body;

    // Validate addFund data before update
    const { error } = validateUpdateAddFund(addFundDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing addFund by addFundId
    const existingAddFund = await AddFundModel.findOne({ _id: addFundId });
    if (!existingAddFund) {
      return res.status(404).json({ message: "AddFund not found" });
    }

    // Update addFund fields
    Object.assign(existingAddFund, addFundDataToUpdate);
    const updatedAddFund = await existingAddFund.save();

    // Send the updated addFund as JSON response
    res.status(200).json({ message: "AddFund updated successfully", addFund: updatedAddFund });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete AddFund
export async function deleteAddFund(req, res, next) {
  try {
    const addFundId = req.params.id;
    const updatedAddFund = await AddFundModel.findOneAndUpdate(
      { _id: addFundId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedAddFund) {
      return res.status(404).json({ message: "AddFund not found." });
    }

    res.status(200).json({ message: "AddFund deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}