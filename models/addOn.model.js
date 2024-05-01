import mongoose from "mongoose";

const { Schema } = mongoose;

const addOnschema = new Schema(
  {
    addOnName: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    veriationId: [{ type: Schema.Types.ObjectId, ref: 'Veriation' }],
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("AddOn", addOnschema);
