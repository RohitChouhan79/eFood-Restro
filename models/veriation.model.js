import mongoose from "mongoose";

const { Schema } = mongoose;

const veriationschema = new Schema(
  {
    veriationName: { type: String },
    foodMenuId: { type: Schema.Types.ObjectId, ref: 'FoodMenu' },
    addOnId: { type: Schema.Types.ObjectId, ref: 'AddOn' },
    dineInPrice: { type: Number, default: 0 },
    takeAwayPrice: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Veriation", veriationschema);
