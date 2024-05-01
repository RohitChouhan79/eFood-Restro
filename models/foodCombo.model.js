import mongoose from "mongoose";

const { Schema } = mongoose;

const foodComboschema = new Schema(
  {
    foodComboName: { type: String, },
    foodComboNameCode: { type: String },
    foodMenuId: { type: Schema.Types.ObjectId, ref: 'Cuisine' },
    foodCategoryId: {  type: Schema.Types.ObjectId, ref: 'FoodCategory' },
    dineInPrice: { type: String },
    takeAwayPrice: { type: String },
    deliveryPrice: { type: Schema.Types.ObjectId, ref: 'DeliveryPartner' },
    description: { type: String },
    isItVeg: { type: Boolean, default: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("FoodCombo", foodComboschema);
