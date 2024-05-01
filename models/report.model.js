import mongoose from "mongoose";

const { Schema } = mongoose;

const reportschema = new Schema(
  {
    cashierId: { type: Schema.Types.ObjectId, ref: 'Employee' },
    totalSales: { type: Number, default: 0 },
    totalProfit: { type: Number, default: 0 },
    totalTax: { type: Number, default: 0 },
    totalDiscount: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Report", reportschema);
