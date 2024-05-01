import KOTModel from "../models/kot.model.js";
import BranchModel from "../models/branch.model.js";
import WaiterModel from "../models/waiter.model.js";
import TableModel from "../models/table.model.js";
import FoodMenuModel from "../models/foodMenu.model.js";
import OrderModel from "../models/order.model.js";
import { validateCreateKOT, validateUpdateKOT } from '../validators/kot.validator.js';

// KOT New
export async function insertKOT(req, res) {
  try {
    const kotData = req.body;

    // Validate kot data before insertion
    const { error } = validateCreateKOT(kotData);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Check if branchId is active
    const branch = await BranchModel.findById(kotData.branchId);
    if (!branch || !branch.is_active) {
      return res.status(400).json({ error: "Branch is not active" });
    }

    // Check if waiterId is active
    const waiter = await WaiterModel.findById(kotData.waiterId);
    if (!waiter || !waiter.is_active) {
      return res.status(400).json({ error: "Waiter is not active" });
    }

    // Check if tableId is active
    const table = await TableModel.findById(kotData.tableId);
    if (!table || !table.is_active) {
      return res.status(400).json({ error: "Table is not active" });
    }

    // Check if foodMenuId is active
    // const foodMenu = await FoodMenuModel.findById(kotData.foodMenuId);
    // if (!foodMenu || !foodMenu.is_active) {
    //   return res.status(400).json({ error: "FoodMenu is not active" });
    // }

    // Check if orderId is active
    const order = await OrderModel.findById(kotData.orderId);
    if (!order || !order.is_active) {
      return res.status(400).json({ error: "Order is not active" });
    }

    // Get the latest KOT number from the database
    const latestKOT = await KOTModel.findOne({}, {}, { sort: { 'createdAt': -1 } });
    let latestKOTNumber = 0;
    if (latestKOT) {
      const latestKOTNumberStr = latestKOT.kotNumber.split('-')[1];
      latestKOTNumber = parseInt(latestKOTNumberStr);
    }

    // Generate the new KOT number
    const newKOTNumber = `KOT-${(latestKOTNumber + 1).toString().padStart(2, '0')}`;
    kotData.kotNumber = newKOTNumber;

    // Insert kot with itemId
    const newKOT = new KOTModel(kotData);
    const savedKOT = await newKOT.save();

    // Update the occupiedTable field of the table associated with the KOT to true
    table.occupiedTable = true;
    await table.save();

    // Add KOT to the order's KOTId array
    order.KOTId.push(savedKOT._id);
    await order.save();

    // Send Response
    res.status(200).json({ message: "KOT data inserted", datashow: savedKOT });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}



// KOT List
export async function showAllKOTs(req, res) {
  try {
    const kot = await KOTModel.find({ is_active: "true" }).select('-password');

    if (!kot || kot.length === 0) {
      console.log("KOT not found");
      return res.status(404).json({ message: "KOT not found" });
    }

    res.status(200).json({ kot });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single KOT
export async function showKOT(req, res) {
  try {
    const kotId = req.params.id; // Corrected variable name
    const kot = await KOTModel.findOne({ _id: kotId }); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const kot = await KOTModel.find({ _id: id }); // Corrected field name
    console.log(kot);

    if (!kot) {
      return res.status(404).json({ message: "KOT not found" });
    }

    res.status(200).json({ kot });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update KOT
export async function updateKOT(req, res) {
  try {
    const kotId = req.params.id;
    const kotDataToUpdate = req.body;

    // Validate kot data before update
    const { error } = validateUpdateKOT(kotDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing kot by kotId
    const existingKOT = await KOTModel.findOne({ _id: kotId });
    if (!existingKOT) {
      return res.status(404).json({ message: "KOT not found" });
    }

    // Update kot fields
    Object.assign(existingKOT, kotDataToUpdate);
    const updatedKOT = await existingKOT.save();

    // Send the updated kot as JSON response
    res.status(200).json({ message: "KOT updated successfully", kot: updatedKOT });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete KOT
export async function deleteKOT(req, res, next) {
  try {
    const kotId = req.params.id;
    const updatedKOT = await KOTModel.findOneAndUpdate(
      { _id: kotId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedKOT) {
      return res.status(404).json({ message: "KOT not found." });
    }

    res.status(200).json({ message: "KOT deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}