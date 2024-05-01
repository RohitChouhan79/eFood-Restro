import mongoose from "mongoose";

const { Schema } = mongoose;

const purchaseItemSchema = new Schema(
  {
    purchaseId: { type: Schema.Types.ObjectId, ref: "Purchase" },
    itemId: { type: Schema.Types.ObjectId, ref: "Ingredient" },
    quantity: { type: Number, default: 0 },
    unitOfMeasurement: { type: String },
    price: { type: Number, default: 0 },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "Employee" },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("PurchaseItem", purchaseItemSchema);
