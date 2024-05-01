import PaymentModel from "../models/payment.model.js";
import IngredientUnitModel from "../models/ingredientUnit.model.js";
import EmployeeModel from "../models/employee.model.js";
import BranchModel from "../models/branch.model.js";
import { validateCreatePayment, validateUpdatePayment } from '../validators/payment.validator.js';

// Payment New
export async function insertPayment(req, res) {
  try {
      const paymentData = req.body;

      // Validate payment data before insertion
      const { error } = validateCreatePayment(paymentData);
      if (error) {
          return res.status(400).json({ error: error.message });
      }

      // Check if customerId is active
      const ingredientUnit = await IngredientUnitModel.findById(paymentData.ingredientUnitId);
      if (!ingredientUnit || !ingredientUnit.is_active) {
        return res.status(400).json({ error: "Ingredient Unit is not active" });
      }

      // Check if customerId is active
      const employee = await EmployeeModel.findById(paymentData.employeeId);
      if (!employee || !employee.is_active) {
        return res.status(400).json({ error: "Employee is not active" });
      }

      // Check if branchId is active
      const branch = await BranchModel.findById(paymentData.branchId);
      if (!branch || !branch.is_active) {
        return res.status(400).json({ error: "Branch is not active" });
      }

      // Insert payment with itemId
      const newPayment = new PaymentModel(paymentData);
      const savedPayment = await newPayment.save();

      // Send Response
      res.status(200).json({ message: "Payment data inserted", datashow: savedPayment });
  } catch (error) {
      return res
          .status(500)
          .json({
              success: false,
              message: error.message || "Something went wrong",
          });
  }
}

// Payment List
export async function showAllPaymentes(req, res) {
  try {
    const payment = await PaymentModel.find({ is_active: "true" }).select('-password');

    if (!payment || payment.length === 0) {
      console.log("Payment not found");
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ payment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single Payment
export async function showPayment(req, res) {
  try {
    const paymentId = req.params.id; // Corrected variable name
    const payment = await PaymentModel.findOne({ _id: paymentId }); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const payment = await PaymentModel.find({ _id: id }); // Corrected field name
    console.log(payment);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ payment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update Payment
export async function updatePayment(req, res) {
  try {
    const paymentId = req.params.id;
    const paymentDataToUpdate = req.body;

    // Validate payment data before update
    const { error } = validateUpdatePayment(paymentDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing payment by paymentId
    const existingPayment = await PaymentModel.findOne({ _id: paymentId });
    if (!existingPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Update payment fields
    Object.assign(existingPayment, paymentDataToUpdate);
    const updatedPayment = await existingPayment.save();

    // Send the updated payment as JSON response
    res.status(200).json({ message: "Payment updated successfully", payment: updatedPayment });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete Payment
export async function deletePayment(req, res, next) {
  try {
    const paymentId = req.params.id;
    const updatedPayment = await PaymentModel.findOneAndUpdate(
      { _id: paymentId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found." });
    }

    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}
