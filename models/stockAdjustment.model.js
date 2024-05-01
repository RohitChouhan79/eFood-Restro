import mongoose from "mongoose";

const { Schema } = mongoose;

// Define possible values for adjustmentType
const adjustmentTypeOptions = ['Restock', 'Sale', 'Damage', 'Transfer', 'Expiry', 'Promotion'];

const stockAdjustmentSchema = new Schema(
  {
    branchStockId: { type: Schema.Types.ObjectId, ref: 'BranchStock' },
    adjustmentType: { type: String, enum: adjustmentTypeOptions },
    quantityChange: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("StockAdjustment", stockAdjustmentSchema);
