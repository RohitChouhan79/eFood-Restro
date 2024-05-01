import BillingModel from "../models/billing.model.js";
import OrderModel from "../models/order.model.js";
import FoodMenuModel from "../models/foodMenu.model.js";
import CouponModel from "../models/coupon.model.js"; 
import { validateCreateBilling, validateUpdateBilling } from '../validators/billing.validator.js';

// Billing New
export async function insertBilling(req, res) {
  try {
    const billingData = req.body;

    // Validate billing data before insertion
    const { error } = validateCreateBilling(billingData);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Check if orderId is active
    const orders = await OrderModel.findById(billingData.orderId);
    if (!orders || !orders.is_active) {
      return res.status(400).json({ error: "Order is not active" });
    }

    // Get the latest Billing number from the database
    const latestBilling = await BillingModel.findOne({}, {}, { sort: { 'createdAt': -1 } });
    let latestBillNumber = 0;
    if (latestBilling) {
      const latestBillNumberStr = latestBilling.billNumber.split('-')[1];
      latestBillNumber = parseInt(latestBillNumberStr);
    }

    // Generate the new Billing number
    const newBillNumber = `BILL-${(latestBillNumber + 1).toString().padStart(2, '0')}`;
    billingData.billNumber = newBillNumber;

    // Insert billing with itemId
    const newBilling = new BillingModel(billingData);
    const savedBilling = await newBilling.save();

    // Update stock quantity in FoodMenu
    for (const particular of billingData.particulars) {
      const foodMenuId = particular.foodMenuId;
      const quantity = particular.quantity;

      // Find the food menu item
      const foodMenu = await FoodMenuModel.findById(foodMenuId);
      if (foodMenu) {
        // Update the stock quantity based on the stockType
        if (foodMenu.foodMenuStock.stockType === 'fixed' || foodMenu.foodMenuStock.stockType === 'daily') {
          // Deduct the quantity from stock
          foodMenu.foodMenuStock.stockNumber -= quantity;
          // Ensure stockNumber doesn't go below 0
          if (foodMenu.foodMenuStock.stockNumber < 0) {
            foodMenu.foodMenuStock.stockNumber = 0;
          }
          // Save the updated food menu item
          await foodMenu.save();
        }
      }
    }

    // If a couponId is provided
    if (billingData.couponId) {
      // Update CouponModel
      const coupon = await CouponModel.findById(billingData.couponId);
      if (coupon) {
        // Increment userLimitCount
        coupon.userLimitCount += 1;
        // Check if userLimitCount equals userLimit
        if (coupon.userLimitCount === coupon.userLimit) {
          coupon.is_active = false; // Set is_active to false
        }
        // Save the updated coupon
        await coupon.save();
      }
    }

    // Send Response
    res.status(200).json({ message: "Billing data inserted", datashow: savedBilling });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}




// Billing List
export async function showAllBillings(req, res) {
  try {
    const billing = await BillingModel.find({ is_active: "true" });

    if (!billing || billing.length === 0) {
      console.log("Billing not found");
      return res.status(404).json({ message: "Billing not found" });
    }

    res.status(200).json({ billing });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single Billing
export async function showBilling(req, res) {
  try {
    const billingId = req.params.id; // Corrected variable name
    const billing = await BillingModel.findOne({ _id: billingId }).populate('orderId'); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const billing = await BillingModel.find({ _id: id }); // Corrected field name
    console.log(billing);

    if (!billing) {
      return res.status(404).json({ message: "Billing not found" });
    }

    res.status(200).json({ billing });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update Billing
export async function updateBilling(req, res) {
  try {
    const billingId = req.params.id;
    const billingDataToUpdate = req.body;

    // Validate billing data before update
    const { error } = validateUpdateBilling(billingDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing billing by billingId
    const existingBilling = await BillingModel.findOne({ _id: billingId });
    if (!existingBilling) {
      return res.status(404).json({ message: "Billing not found" });
    }

    // Update billing fields
    Object.assign(existingBilling, billingDataToUpdate);
    const updatedBilling = await existingBilling.save();

    // Send the updated billing as JSON response
    res.status(200).json({ message: "Billing updated successfully", billing: updatedBilling });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete Billing
export async function deleteBilling(req, res, next) {
  try {
    const billingId = req.params.id;
    const updatedBilling = await BillingModel.findOneAndUpdate(
      { _id: billingId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedBilling) {
      return res.status(404).json({ message: "Billing not found." });
    }

    res.status(200).json({ message: "Billing deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}
