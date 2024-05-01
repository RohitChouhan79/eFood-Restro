import mongoose from "mongoose";

const { Schema } = mongoose;

const inventoryStockschema = new Schema(
  {
    inventoryId: { type: Schema.Types.ObjectId, ref: "Inventory" },
    items: [
      {
        itemName: { type: String },
        totalQuantity: { type: Number, default: 0 },
        unitOfMeasurement: { type: String },
        alertQuantity: { type: Number, default: 0 },
        minimumQuantity: { type: Number, default: 0 },
      },
    ],
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("InventoryStock", inventoryStockschema);
