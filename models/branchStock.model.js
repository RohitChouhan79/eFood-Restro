import mongoose from "mongoose";

const { Schema } = mongoose;

const BranchStockSchema = new Schema(
  {
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    items: { type: String },
    qty: { type: Number, default: 0 },
    flag: { type: String },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("BranchStock", BranchStockSchema);
