import CustomerModel from "../models/customer.model.js";
import OrderModel from "../models/order.model.js";
import BillingModel from "../models/billing.model.js";
import { validateCreateCustomer, validateUpdateCustomer } from '../validators/customer.validator.js';
import bcrypt from "bcrypt";

export async function insertCustomer(req, res) {
  try {
    const customerData = req.body;

    // Validate customer data before insertion
    const { error } = validateCreateCustomer(customerData);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    // Check if emailAddress already exists in CustomerModel
    const existingCustomer = await CustomerModel.findOne({
      emailAddress: customerData.emailAddress,
    });
    if (existingCustomer) {
      return res
        .status(400)
        .json({ error: "Customer with the given emailAddress already exists" });
    }
    // Replace the plain password with the hashed one
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(customerData.password, saltRounds);

    // Insert Customer with customerId
    const newCustomer = new CustomerModel({
      ...customerData,
      password: hashedPassword,
    });
    const savedCustomer = await newCustomer.save();

    // Send Response
    res.status(200).json({
      message: "Customer data inserted",
      customerData: savedCustomer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}

// Customer List
export async function showAllCustomers(req, res) {
  try {
    const customer = await CustomerModel.find({ is_active: "true" }).select('-password');

    if (!customer || customer.length === 0) {
      console.log("Customer not found");
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ customer });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single Customer
export async function showCustomer(req, res) {
  try {
    const customerId = req.params.id; // Corrected variable name
    const customer = await CustomerModel.findOne({ _id: customerId })

    console.log(customer);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ customer });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update Customer
export async function updateCustomer(req, res) {
  try {
    const customerId = req.params.id;
    const customerDataToUpdate = req.body;

    // Validate customer data before update
    const { error } = validateUpdateCustomer(customerDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing customer by customerId
    const existingCustomer = await CustomerModel.findOne({ _id: customerId });
    if (!existingCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Update customer fields
    Object.assign(existingCustomer, customerDataToUpdate);
    const updatedCustomer = await existingCustomer.save();

    // Send the updated customer as JSON response
    res.status(200).json({ message: "Customer updated successfully", customer: updatedCustomer });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete Customer
export async function deleteCustomer(req, res, next) {
  try {
    const customerId = req.params.id;
    const updatedCustomer = await CustomerModel.findOneAndDelete(
      { _id: customerId },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Is_Active Customer
export async function is_activeCustomer(req, res, next) {
  try {
    const customerId = req.params.id;
    const updatedCustomer = await CustomerModel.findOneAndUpdate(
      { _id: customerId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

//Search customer
export async function searchCustomer(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query params
    const searchRegex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex pattern for searching

    // Find customers that match any field using the regex pattern
    const customers = await CustomerModel.find({
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

    if (!customers || customers.length === 0) {
      return res.status(404).json({ message: "No customers found" });
    }

    res.status(200).json({ customers });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// Function to get order count for a particular customer
export async function getOrderCountForCustomer(req, res) {
  try {
    const customerId = req.params.id;

    // Count orders where the customerId matches
    const orderCount = await OrderModel.countDocuments({ customerId });

    res.status(200).json({ orderCount });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// Function to get final total amount for a customer
export async function getFinalTotalForCustomer(req, res) {
  try {
    const customerId = req.params.id;

    // Find all orders of the customer
    const orders = await OrderModel.find({ customerId });

    // Initialize total amount
    let totalAmount = 0;

    // Iterate through each order to sum up final totals
    for (const order of orders) {
      const billing = await BillingModel.findOne({ orderId: order._id });
      if (billing) {
        totalAmount += billing.finalTotal;
      }
    }

    // Send the total amount as JSON response
    res.status(200).json({ totalAmount });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}