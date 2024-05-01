import mongoose from "mongoose";

const { Schema } = mongoose;

const orderschema = new Schema(
  {
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
    waiterId: { type: Schema.Types.ObjectId, ref: 'Waiter' },
    deliveryManId: { type: Schema.Types.ObjectId, ref: 'DeliveryPartner' },
    orderCode: { type: String },
    orderNumber: { type: Number, default: 0 },
    orderType: { type: String, default: 'delivery', enum: ['delivery', 'take_Away', 'dine_In'] },
    tableId: { type: Schema.Types.ObjectId, ref: 'Table' },
    KOTId: [{ type: Schema.Types.ObjectId, ref: 'KOT' }],
    totalOrderPrice: { type: Number, default: 0 },
    orderStatus: { type: String, default: 'pending', enum: ['pending', 'Confirmed', 'processing', 'outForDelivery', 'delivered', 'schedule', 'cancelled', 'returned', 'failedToDeliver'] },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Order", orderschema);
