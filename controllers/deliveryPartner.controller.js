import DeliveryPartnerModel from "../models/deliveryPartner.model.js";
import BranchModel from "../models/branch.model.js";
import EmployeeModel from "../models/employee.model.js";
import { validateCreateDeliveryPartner, validateUpdateDeliveryPartner } from '../validators/deliveryPartner.validator.js';
import bcrypt from "bcrypt";

// DeliveryPartner New
export async function insertDeliveryPartner(req, res) {
  try {
    const deliveryPartnerData = req.body;

    // Validate deliveryPartner data before insertion
    const { error } = validateCreateDeliveryPartner(deliveryPartnerData);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Check if branchId is active
    const branch = await BranchModel.findById(deliveryPartnerData.branchId);
    if (!branch || !branch.is_active) {
      return res.status(400).json({ error: "Branch is not active" });
    }

    // Check if emailAddress already exists in DeliveryPartnerModel
    const existingDeliveryPartner = await DeliveryPartnerModel.findOne({
      emailAddress: deliveryPartnerData.emailAddress,
    });
    if (existingDeliveryPartner) {
      return res.status(400).json({ error: "DeliveryPartner with the given emailAddress already exists" });
    }

    // Replace the plain password with the hashed one
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(deliveryPartnerData.password, saltRounds);

    // Insert DeliveryPartner with deliveryPartnerId
    const newDeliveryPartner = new DeliveryPartnerModel({
      ...deliveryPartnerData,
      password: hashedPassword,
    });
    const savedDeliveryPartner = await newDeliveryPartner.save();

    // Update Branch document
    branch.Deliveryman.push({
      deliveryPartnerId: savedDeliveryPartner._id,
      requestStatus: 'Pending'
    });
    await branch.save();

    // Find and update Employee document if the employeeType is "Admin"
    const adminEmployee = await EmployeeModel.findOne({ branchId: branch._id, employeeType: 'Admin' });
    if (adminEmployee) {
      adminEmployee.Deliveryman.push({
        deliveryPartnerId: savedDeliveryPartner._id,
        requestStatus: 'Pending'
      });
      await adminEmployee.save();
    }

    // Send Response
    res.status(200).json({
      message: "DeliveryPartner data inserted",
      deliveryPartnerData: savedDeliveryPartner,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}

// DeliveryPartner List
export async function showAllDeliveryPartners(req, res) {
  try {
    const deliveryPartner = await DeliveryPartnerModel.find({ is_active: "true" }).select('-password');

    if (!deliveryPartner || deliveryPartner.length === 0) {
      console.log("DeliveryPartner not found");
      return res.status(404).json({ message: "DeliveryPartner not found" });
    }

    res.status(200).json({ deliveryPartner });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single DeliveryPartner
export async function showDeliveryPartner(req, res) {
  try {
    const deliveryPartnerId = req.params.id; // Corrected variable name
    const deliveryPartner = await DeliveryPartnerModel.findOne({ _id: deliveryPartnerId })
      .select('-password')
      .populate({ path: 'branchId', select: '-password' })

    console.log(deliveryPartner);

    if (!deliveryPartner) {
      return res.status(404).json({ message: "DeliveryPartner not found" });
    }

    res.status(200).json({ deliveryPartner });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update DeliveryPartner
export async function updateDeliveryPartner(req, res) {
  try {
    const deliveryPartnerId = req.params.id;
    const deliveryPartnerDataToUpdate = req.body;

    // Validate deliveryPartner data before update
    const { error } = validateUpdateDeliveryPartner(deliveryPartnerDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing deliveryPartner by deliveryPartnerId
    const existingDeliveryPartner = await DeliveryPartnerModel.findOne({ _id: deliveryPartnerId });
    if (!existingDeliveryPartner) {
      return res.status(404).json({ message: "DeliveryPartner not found" });
    }

    // Update deliveryPartner fields
    Object.assign(existingDeliveryPartner, deliveryPartnerDataToUpdate);
    const updatedDeliveryPartner = await existingDeliveryPartner.save();

    // Send the updated deliveryPartner as JSON response
    res.status(200).json({ message: "DeliveryPartner updated successfully", deliveryPartner: updatedDeliveryPartner });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete DeliveryPartner
export async function deleteDeliveryPartner(req, res, next) {
  try {
    const deliveryPartnerId = req.params.id;
    const updatedDeliveryPartner = await DeliveryPartnerModel.findOneAndDelete(
      { _id: deliveryPartnerId },
      { new: true }
    );

    if (!updatedDeliveryPartner) {
      return res.status(404).json({ message: "DeliveryPartner not found." });
    }

    res.status(200).json({ message: "DeliveryPartner deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Is_Active DeliveryPartner
export async function is_activeDeliveryPartner(req, res, next) {
  try {
    const deliveryPartnerId = req.params.id;
    const updatedDeliveryPartner = await DeliveryPartnerModel.findOneAndUpdate(
      { _id: deliveryPartnerId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedDeliveryPartner) {
      return res.status(404).json({ message: "DeliveryPartner not found." });
    }

    res.status(200).json({ message: "DeliveryPartner deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

//Search deliveryPartner
export async function searchDeliveryPartner(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query params
    const searchRegex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex pattern for searching

    // Find deliveryPartners that match any field using the regex pattern
    const deliveryPartners = await DeliveryPartnerModel.find({
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { identityType: searchRegex },
        { emailAddress: searchRegex },
        { 'address.streetName': searchRegex },
        { 'address.landMark': searchRegex },
        { 'address.city': searchRegex },
        { 'address.pinCode': searchRegex },
        { 'address.state': searchRegex },
        { 'address.country': searchRegex }
      ],
    });

    if (!deliveryPartners || deliveryPartners.length === 0) {
      return res.status(404).json({ message: "No deliveryPartners found" });
    }

    res.status(200).json({ deliveryPartners });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}
