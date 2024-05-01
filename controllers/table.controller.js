import TableModel from "../models/table.model.js";
import BranchModel from "../models/branch.model.js";
import { validateCreateTable, validateUpdateTable } from '../validators/table.validator.js';

// Table New
export async function insertTable(req, res) {
  try {
      const tableData = req.body;

      // Validate table data before insertion
      const { error } = validateCreateTable(tableData);
      if (error) {
          return res.status(400).json({ error: error.message });
      }

      // Check if branchId is active
      const branch = await BranchModel.findById(tableData.branchId);
      if (!branch || !branch.is_active) {
        return res.status(400).json({ error: "Branch is not active" });
      }

      // Find the last table in the branch to calculate the next table number
      const lastTable = await TableModel.findOne({ branchId: tableData.branchId })
        .sort({ tableNumber: -1 }); // Sort in descending order to get the last table
      let nextTableNumber = 1;
      if (lastTable) {
        nextTableNumber = lastTable.tableNumber + 1;
      }

      // Assign the calculated tableNumber to the tableData
      tableData.tableNumber = nextTableNumber;

      // Insert table with itemId
      const newTable = new TableModel(tableData);
      const savedTable = await newTable.save();

      // Send Response
      res.status(200).json({ message: "Table data inserted", datashow: savedTable });
  } catch (error) {
      return res.status(500).json({
          success: false,
          message: error.message || "Something went wrong",
      });
  }
}

// Table List
export async function showAllTables(req, res) {
  try {
    const table = await TableModel.find({ is_active: "true" }).select('-password').populate('branchId');

    if (!table || table.length === 0) {
      console.log("Table not found");
      return res.status(404).json({ message: "Table not found" });
    }

    res.status(200).json({ table });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single Table
export async function showTable(req, res) {
  try {
    const tableId = req.params.id; // Corrected variable name
    const table = await TableModel.findOne({ _id: tableId }).populate({ path: 'branchId', select: '-password' }); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const table = await TableModel.find({ _id: id }); // Corrected field name
    console.log(table);

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.status(200).json({ table });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update Table
export async function updateTable(req, res) {
  try {
    const tableId = req.params.id;
    const tableDataToUpdate = req.body;

    // Validate table data before update
    const { error } = validateUpdateTable(tableDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing table by tableId
    const existingTable = await TableModel.findOne({ _id: tableId });
    if (!existingTable) {
      return res.status(404).json({ message: "Table not found" });
    }

    // Update table fields
    Object.assign(existingTable, tableDataToUpdate);
    const updatedTable = await existingTable.save();

    // Send the updated table as JSON response
    res.status(200).json({ message: "Table updated successfully", table: updatedTable });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete Table
export async function deleteTable(req, res, next) {
  try {
    const tableId = req.params.id;
    const updatedTable = await TableModel.findOneAndUpdate(
      { _id: tableId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedTable) {
      return res.status(404).json({ message: "Table not found." });
    }

    res.status(200).json({ message: "Table deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}
