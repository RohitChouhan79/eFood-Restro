import mongoose from "mongoose";

const { Schema } = mongoose;

const billingschema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    couponId: { type: Schema.Types.ObjectId, ref: 'Coupon' },
    billNumber: { type: String, maxlength: 16 },
    particulars: [{
      foodMenuId: { type: Schema.Types.ObjectId, ref: 'FoodMenu' },
      quantity: { type: Number, default: 0 },
      rate: { type: Number, default: 0 },
      amount: { type: Number, default: 0 }
    }],
    subTotal: { type: Number, default: 0 },
    CGST: { type: Number, default: 0 },
    SGST: { type: Number, default: 0 },
    finalTotal: { type: Number, default: 0 },
    gstNo: { type: String, unique: true },
    paymentStatus: { type: String, default: 'pending', enum: ['pending', 'denied'] },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Billing", billingschema);
