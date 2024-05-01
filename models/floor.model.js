import mongoose from "mongoose";

const { Schema } = mongoose;

const floorschema = new Schema(
  {
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    floorNumber: { type: Number, default: 0 },
    sectionName: { type: String },
    description: { type: String },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Floor", floorschema);
