import mongoose from "mongoose";

const { Schema } = mongoose;

const foodCategoryschema = new Schema(
  {
    foodCategoryName: { type: String },
    foodMenuId: [{ type: Schema.Types.ObjectId, ref: 'FoodMenu' }],
    description: { type: String },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("FoodCategory", foodCategoryschema);
