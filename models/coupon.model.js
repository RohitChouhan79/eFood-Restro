import mongoose from "mongoose";

const { Schema } = mongoose;

const couponschema = new Schema(
  {
    couponTitle: { type: String },
    couponCode: { type: String, unique: true },
    couponType: { type: String, enum: ["Firstorder", "Free Delivery"], default: "Customer Wise" },
    discountType: { type: String, enum: ["Precent", "Amount"], default: "Precent" },
    discountPercent: { type: Number, default: 0 },
    minimumPurchase: { type: Number, default: 0 },
    maximumDiscount: { type: Number, default: 0 },
    startDate: { type: Date },
    expiryDate: { type: Date },
    userLimit: { type: Number, default: 0 },
    userLimitCount: { type: Number, default: 0 },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);

// // Pre save hook to update userLimitCount based on userLimit
// couponschema.pre('save', function(next) {
//   if (this.isNew && this.userLimit) {
//     this.userLimitCount = this.userLimit;
//   }
//   next();
// });

export default mongoose.model("Coupon", couponschema);
