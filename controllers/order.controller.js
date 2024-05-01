import OrderModel from "../models/order.model.js";
import BranchModel from "../models/branch.model.js";
import CustomerModel from "../models/customer.model.js";
import TableModel from "../models/table.model.js";
import WaiterModel from "../models/waiter.model.js";
import DeliveryPartnerModel from "../models/deliveryPartner.model.js";
import { validateCreateOrder, validateUpdateOrder } from '../validators/order.validator.js';

// Function to generate a random 6-digit code
function generateOrderCode() {
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Order New
export async function insertOrder(req, res) {
  try {
    const orderData = req.body;

    // Validate order data before insertion
    const { error } = validateCreateOrder(orderData);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Check if branchId is active
    const branch = await BranchModel.findById(orderData.branchId);
    if (!branch || !branch.is_active) {
      return res.status(400).json({ error: "Branch is not active" });
    }

    // Check if customerId is active
    const customer = await CustomerModel.findById(orderData.customerId);
    if (!customer || !customer.is_active) {
      return res.status(400).json({ error: "Customer is not active" });
    }

    // Check if waiterId is active
    const waiter = await WaiterModel.findById(orderData.waiterId);
    if (!waiter || !waiter.is_active) {
      return res.status(400).json({ error: "Waiter is not active" });
    }

    // Check if deliveryPriceId is active
    const deliveryPartner = await DeliveryPartnerModel.findById(orderData.deliveryManId);
    if (!deliveryPartner || !deliveryPartner.is_active) {
      return res.status(400).json({ error: "DeliveryPartner is not active" });
    }

    // If orderType is "dine_In", check if tableId is provided and active
    if (orderData.orderType === "dine_In") {
      // Check if tableId is provided
      if (!orderData.tableId) {
        return res.status(400).json({ error: "tableId is required for dine-in orders" });
      }

      // Check if tableId is active
      const table = await TableModel.findById(orderData.tableId);
      if (!table || !table.is_active) {
        return res.status(400).json({ error: "Table is not active" });
      }
    } else {
      // If orderType is not "dine_In" but tableId is provided
      if (orderData.tableId) {
        return res.status(400).json({ error: "Table cannot be selected for non dine-in orders" });
      }
    }

    // Generate 6-digit orderCode
    const orderCode = generateOrderCode();

    // Assign the orderCode to the orderData
    orderData.orderCode = orderCode.toString(); // Convert number to string

    // Find the last order in the branch to calculate the next order number
    const lastOrder = await OrderModel.findOne({ branchId: orderData.branchId })
      .sort({ orderNumber: -1 }); // Sort in descending order to get the last order

    let nextOrderNumber = 1;
    if (lastOrder) {
      nextOrderNumber = lastOrder.orderNumber + 1;
    }

    // Assign the calculated orderNumber to the orderData
    orderData.orderNumber = nextOrderNumber;

    // Find the count of orderNumber in the branch
    const orderCount = await OrderModel.countDocuments({ branchId: orderData.branchId });

    // Assign the orderCount to the orderData
    orderData.orderCount = orderCount + 1;

    // Insert order with itemId
    const newOrder = new OrderModel(orderData);
    const savedOrder = await newOrder.save();

    // Update deliveryPartnerSchema with new FoodMenu reference
    deliveryPartner.orderId.push(savedOrder._id);
    await deliveryPartner.save();

    // Send Response
    res.status(200).json({ message: "Order data inserted", datashow: savedOrder, orderCount: orderData.orderCount });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Order List
export async function showAllOrders(req, res) {
  try {
    const order = await OrderModel.find({ is_active: "true" }).select('-password');

    if (!order || order.length === 0) {
      console.log("Order not found");
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single Order
export async function showOrder(req, res) {
  try {
    const orderId = req.params.id; // Corrected variable name
    const order = await OrderModel.findOne({ _id: orderId }); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const order = await OrderModel.find({ _id: id }); // Corrected field name
    console.log(order);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update Order
export async function updateOrder(req, res) {
  try {
    const orderId = req.params.id;
    const orderDataToUpdate = req.body;

    // Validate order data before update
    const { error } = validateUpdateOrder(orderDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing order by orderId
    const existingOrder = await OrderModel.findOne({ _id: orderId });
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update order fields
    Object.assign(existingOrder, orderDataToUpdate);
    const updatedOrder = await existingOrder.save();

    // Send the updated order as JSON response
    res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete Order
export async function deleteOrder(req, res, next) {
  try {
    const orderId = req.params.id;
    const updatedOrder = await OrderModel.findOneAndUpdate(
      { _id: orderId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Restart Order Number
export async function restartOrderNumber(req, res) {
  try {
    // Update all order numbers
    await OrderModel.updateMany({}, { $set: { orderNumber: 0 } });

    res.status(200).json({ message: "Order numbers restarted successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

//Search order
export async function searchOrder(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query params
    const searchRegex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex pattern for searching

    // Find orders that match any field using the regex pattern
    const orders = await OrderModel.find({
      $or: [
        { orderCode: searchRegex }
      ],
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

