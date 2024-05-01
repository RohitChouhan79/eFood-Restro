import mongoose from "mongoose";

const { Schema } = mongoose;

const tableschema = new Schema(
  {
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    tableNumber: { type: Number, default: 0 },
    seatingCapacity: { type: Number, default: 0 },
    occupiedTable: { type: Boolean },
    description: { type: String },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Table", tableschema);
