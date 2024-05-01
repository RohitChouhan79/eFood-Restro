import mongoose from "mongoose";

const { Schema } = mongoose;

const cuisineschema = new Schema(
  {
    cuisineName: { type: String },
    foodMenuId: [{ type: Schema.Types.ObjectId, ref: 'FoodMenu' }],
    description: { type: String },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Cuisine", cuisineschema);
