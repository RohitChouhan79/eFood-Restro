import mongoose from "mongoose";

const { Schema } = mongoose;

const inventoryschema = new Schema(
  {
    inventoryName: { type: String },
    location: { type: String },
    description: { type: String },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Inventory", inventoryschema);
