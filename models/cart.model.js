import mongoose from "mongoose";

const { Schema } = mongoose;

const cartschema = new Schema(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee' },
    items: [{
      foodMenu: { type: Schema.Types.ObjectId, ref: 'FoodMenu' },
      quantity: { type: Number, default: 0 }
    }],
    totalItemsCount: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Cart", cartschema);
