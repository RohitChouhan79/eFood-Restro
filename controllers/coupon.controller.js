import CouponModel from "../models/coupon.model.js";
import { validateCreateCoupon, validateUpdateCoupon } from '../validators/coupon.validator.js';
import cron from 'node-cron';

// Function to generate a random alphanumeric string of given length
function generateCouponCode(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let couponCode = '';
  for (let i = 0; i < length; i++) {
    couponCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return couponCode;

}
// Coupon New
export async function insertCoupon(req, res) {
  try {
    const couponData = req.body;
    console.log("couponData", couponData);

    // Validate coupon data before insertion
    const { error } = validateCreateCoupon(couponData);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Generate a unique coupon code
    let couponCode;
    let isCodeUnique = false;
    while (!isCodeUnique) {
      couponCode = generateCouponCode(7);
      // Check if coupon code already exists
      const existingCoupon = await CouponModel.findOne({ couponCode });
      if (!existingCoupon) {
        isCodeUnique = true;
      }
    }

    // Add the generated coupon code to the couponData
    couponData.couponCode = couponCode;

    // Create new coupon instance
    const newCoupon = new CouponModel(couponData);

    // Save the coupon
    const savedCoupon = await newCoupon.save();

    // Schedule a cron job to check and update the is_active status
    cron.schedule('* * * * *', async () => {
      // Check if expiry date is equal to current date
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      console.log("currentDate", currentDate);
      console.log("expire", savedCoupon.expiryDate);


      if (savedCoupon.expiryDate <= currentDate) {
        // If expiry date is equal to or before the current date, set is_active to false
        await CouponModel.findByIdAndUpdate(savedCoupon._id, { is_active: false });
        console.log('Coupon expired and is_active set to false.');
      }
    });

    // Send Response
    res.status(200).json({ message: "Coupon data inserted", datashow: savedCoupon });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}



// Coupon List
export async function showAllCoupons(req, res) {
  try {
    const coupon = await CouponModel.find({ is_active: "true" });

    if (!coupon || coupon.length === 0) {
      console.log("Coupon not found");
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json({ coupon });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single Coupon
export async function showCoupon(req, res) {
  try {
    const couponId = req.params.id; // Corrected variable name
    const coupon = await CouponModel.findOne({ _id: couponId }); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const coupon = await CouponModel.find({ _id: id }); // Corrected field name
    console.log(coupon);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json({ coupon });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update Coupon
export async function updateCoupon(req, res) {
  try {
    const couponId = req.params.id;
    const couponDataToUpdate = req.body;

    // Validate coupon data before update
    const { error } = validateUpdateCoupon(couponDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing coupon by couponId
    const existingCoupon = await CouponModel.findOne({ _id: couponId });
    if (!existingCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    // Update coupon fields
    Object.assign(existingCoupon, couponDataToUpdate);
    const updatedCoupon = await existingCoupon.save();

    // Send the updated coupon as JSON response
    res.status(200).json({ message: "Coupon updated successfully", coupon: updatedCoupon });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete Coupon
export async function deleteCoupon(req, res, next) {
  try {
    const couponId = req.params.id;
    const updatedCoupon = await CouponModel.findOneAndUpdate(
      { _id: couponId },
      { is_active: "false" },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ message: "Coupon not found." });
    }

    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

//Search coupon
export async function searchCoupon(req, res) {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query params
    const searchRegex = new RegExp(searchQuery, 'i'); // Create case-insensitive regex pattern for searching

    // Find coupons that match any field using the regex pattern
    const coupons = await CouponModel.find({
      $or: [
        { couponTitle: searchRegex },
        { couponCode: searchRegex }
      ],
    });

    if (!coupons || coupons.length === 0) {
      return res.status(404).json({ message: "No coupons found" });
    }

    res.status(200).json({ coupons });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}
