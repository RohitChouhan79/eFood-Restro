import mongoose from "mongoose";

const { Schema } = mongoose;

const kitchenschema = new Schema(
  {
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    kitchenArea: { type: Schema.Types.ObjectId, ref: 'Floor' },
    kitchenName: { type: String },
    kitchenCode: { type: String },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Kitchen", kitchenschema);
