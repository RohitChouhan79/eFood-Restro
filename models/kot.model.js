import mongoose from "mongoose";

const { Schema } = mongoose;

const KOTschema = new Schema(
  {
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    waiterId: { type: Schema.Types.ObjectId, ref: 'Waiter' },
    tableId: { type: Schema.Types.ObjectId, ref: 'Table' },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    kotNumber: { type: String },
    items: [
      {
        foodMenuId: { type: Schema.Types.ObjectId, ref: 'FoodMenu' },
        quantity: { type: Number, default: 0, default: 1 },
        customerComment: { type: String, default: null },
      },
    ],
    typeOfOrder: { type: String, default: 'Delivery', enum: ['Delivery', 'Takeaway', 'Table'] },
    cookingStatus: { type: String, enum: ['requested', 'confirmed', 'cooking', 'done'], default: 'requested' },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("KOT", KOTschema);
