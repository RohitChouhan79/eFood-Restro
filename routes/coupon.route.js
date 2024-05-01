import express from "express";
import * as coupon from '../controllers/coupon.controller.js';

const router = express.Router();

// Route for creating a new coupon
router.post("/", coupon.insertCoupon);

// Route for getting all coupons
router.get("/", coupon.showAllCoupons);

// Route for getting a coupon by ID
router.get("/:id", coupon.showCoupon);

// Route for updating a coupon
router.put("/:id", coupon.updateCoupon);

// Route for deleting a coupon
router.delete("/:id", coupon.deleteCoupon);

// Search coupon
router.get('/coupons/search', coupon.searchCoupon);

export default router;
