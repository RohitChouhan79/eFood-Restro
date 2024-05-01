import mongoose from "mongoose";

const { Schema } = mongoose;

const addFundschema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
    fundAmount: { type: Number },
    referenceName: { type: String },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("AddFund", addFundschema);
