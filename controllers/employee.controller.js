import EmployeeModel from "../models/employee.model.js";
import RolePermissionModel from "../models/rolePermission.model.js";
import BranchModel from "../models/branch.model.js";
import { validateCreateEmployee, validateUpdateEmployee } from '../validators/employee.validator.js';
import bcrypt from "bcrypt";

// Employee New
export async function insertEmployee(req, res) {
  try {
    const employeeData = req.body;
    
    // Validate employee data before insertion
    const { error } = validateCreateEmployee(employeeData);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Check if branchId is active
    const branch = await BranchModel.findById(employeeData.branchId);
    if (!branch || !branch.is_active) {
      return res.status(400).json({ error: "branch is not active" });
    }
    
    // Check if roleId is active
    const rolePermission = await RolePermissionModel.findById(employeeData.roleId);
    console.log("rolePermission", rolePermission);
    if (!rolePermission || !rolePermission.is_active) {
      return res.status(400).json({ error: "RolePermission is not active" });
    }

    // Check if emailAddress already exists in EmployeeModel
    const existingEmployee = await EmployeeModel.findOne({
      emailAddress: employeeData.emailAddress,
    });
    if (existingEmployee) {
      return res
        .status(400)
        .json({ error: "Employee with the given emailAddress already exists" });
    }

    // Generate employeeCode based on employeeName
    const existingEmployeeesWithSameName = await EmployeeModel.find({
      employeeName: employeeData.employeeName,
    });
    const employeeCount = existingEmployeeesWithSameName.length + 1;
    const paddedCount = employeeCount.toString().padStart(2, "0");
    const employeeCode = employeeData.employeeName.substring(0, 3).toUpperCase() + "-" + paddedCount;

    // Replace the plain password with the hashed one
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(employeeData.password, saltRounds);

    // Insert Employee with employeeId
    const newEmployee = new EmployeeModel({
      ...employeeData,
      employeeCode: employeeCode,
      password: hashedPassword,
    });
    const savedEmployee = await newEmployee.save();

    // Send Response
    res.status(200).json({
      message: "Employee data inserted",
      employeeData: savedEmployee,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}

// Employee List
export async function showAllEmployees(req, res) {
  try {
    const employee = await EmployeeModel.find({ is_active: "true" }).select('-password');

    if (!employee || employee.length === 0) {
      console.log("Employee not found");
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ employee });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single Employee
export async function showEmployee(req, res) {
  try {
    const employeeId = req.params.id; // Corrected variable name
    const employee = await EmployeeModel.findOne({ _id: employeeId })
      .select('-password')
      .populate({ path: 'branchId', select: '-password' })
      .populate('roleId');

    console.log(employee);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ employee });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update Employee
export async function updateEmployee(req, res) {
  try {
    const employeeId = req.params.id;
    const employeeDataToUpdate = req.body;

    // Validate employee data before update
    const { error } = validateUpdateEmployee(employeeDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing employee by employeeId
    const existingEmployee = await EmployeeModel.findOne({ _id: employeeId });
    if (!existingEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update employee fields
    Object.assign(existingEmployee, employeeDataToUpdate);
    const updatedEmployee = await existingEmployee.save();

    // Send the updated employee as JSON response
    res.status(200).json({ message: "Employee updated successfully", employee: updatedEmployee });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete Employee
export async function deleteEmployee(req, res, next) {
  try {
    const employeeId = req.params.id;
    const updatedEmployee = await EmployeeModel.findOneAndDelete(
      { _id: employeeId },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Is_Active Employee
export async function is_activeEmployee(req, res, next) {
  try {
    const employeeId = req.params.id;
    const updatedEmployee = await EmployeeModel.findOneAndUpdate(
      { _id: employeeId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

//Search employee
export async function searchEmployee(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query params
    const searchRegex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex pattern for searching

    // Find employees that match any field using the regex pattern
    const employees = await EmployeeModel.find({
      $or: [
        { employeeName: searchRegex },
        { employeeType: searchRegex },
        { 'address.streetName': searchRegex },
        { 'address.landMark': searchRegex },
        { 'address.city': searchRegex },
        { 'address.pinCode': searchRegex },
        { 'address.state': searchRegex },
        { 'address.country': searchRegex },
        { emailAddress: searchRegex },
      ],
    });
    console.log("employees", employees);

    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: "No employees found" });
    }

    res.status(200).json({ employees });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}
