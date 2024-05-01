import VeriationModel from "../models/veriation.model.js";
import AddOnModel from "../models/addOn.model.js";
import { validateCreateVeriation, validateUpdateVeriation } from '../validators/veriation.validator.js';

// Veriation New
export async function insertVeriation(req, res) {
  try {
      const veriationData = req.body;
      console.log("veriationData", veriationData);

      // Validate veriation data before insertion
      const { error } = validateCreateVeriation(veriationData);
      if (error) {
          return res.status(400).json({ error: error.message });
      }

      // Check if addOnId is active
      const addOn = await AddOnModel.findById(veriationData.addOnId);
      if (!addOn || !addOn.is_active) {
        return res.status(400).json({ error: "AddOn is not active" });
      }

      // Check if roleName already exists in VeriationModel
      const existingVeriation = await VeriationModel.findOne({
        veriationName: veriationData.veriationName,
      });
      if (existingVeriation) {
        return res
          .status(400)
          .json({ error: "Veriation with the given roleName already exists" });
      }

      // Insert veriation with itemId
      const newVeriation = new VeriationModel(veriationData);
      const savedVeriation = await newVeriation.save();

      // Send Response
      res.status(200).json({ message: "Veriation data inserted", datashow: savedVeriation });
  } catch (error) {
      return res
          .status(500)
          .json({
              success: false,
              message: error.message || "Something went wrong",
          });
  }
}

// Veriation List
export async function showAllVeriations(req, res) {
  try {
    const veriation = await VeriationModel.find({ is_active: "true" }).select('-password');

    if (!veriation || veriation.length === 0) {
      console.log("Veriation not found");
      return res.status(404).json({ message: "Veriation not found" });
    }

    res.status(200).json({ veriation });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single Veriation
export async function showVeriation(req, res) {
  try {
    const veriationId = req.params.id; // Corrected variable name
    const veriation = await VeriationModel.findOne({ _id: veriationId }); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const veriation = await VeriationModel.find({ _id: id }); // Corrected field name
    console.log(veriation);

    if (!veriation) {
      return res.status(404).json({ message: "Veriation not found" });
    }

    res.status(200).json({ veriation });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update Veriation
export async function updateVeriation(req, res) {
  try {
    const veriationId = req.params.id;
    const veriationDataToUpdate = req.body;

    // Validate veriation data before update
    const { error } = validateUpdateVeriation(veriationDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing veriation by veriationId
    const existingVeriation = await VeriationModel.findOne({ _id: veriationId });
    if (!existingVeriation) {
      return res.status(404).json({ message: "Veriation not found" });
    }

    // Update veriation fields
    Object.assign(existingVeriation, veriationDataToUpdate);
    const updatedVeriation = await existingVeriation.save();

    // Send the updated veriation as JSON response
    res.status(200).json({ message: "Veriation updated successfully", veriation: updatedVeriation });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete Veriation
export async function deleteVeriation(req, res, next) {
  try {
    const veriationId = req.params.id;
    const updatedVeriation = await VeriationModel.findOneAndUpdate(
      { _id: veriationId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedVeriation) {
      return res.status(404).json({ message: "Veriation not found." });
    }

    res.status(200).json({ message: "Veriation deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

//Search veriation
export async function searchVeriation(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query params
    const searchRegex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex pattern for searching

    // Find veriations that match any field using the regex pattern
    const veriations = await VeriationModel.find({
      $or: [
        { veriationName: searchRegex }
      ],
    });

    if (!veriations || veriations.length === 0) {
      return res.status(404).json({ message: "No veriations found" });
    }

    res.status(200).json({ veriations });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}
