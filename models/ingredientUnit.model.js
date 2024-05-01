import mongoose from "mongoose";

const { Schema } = mongoose;

const ingredientUnitschema = new Schema(
  {
    ingredientUnitName: { type: String },
    foodMenuId: [{ type: Schema.Types.ObjectId, ref: 'FoodMenu' }],
    description: { type: String },
    ingredientId: [{ type: Schema.Types.ObjectId, ref: 'Ingredient' }],
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("IngredientUnit", ingredientUnitschema);
