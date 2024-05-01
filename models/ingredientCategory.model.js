import mongoose from "mongoose";

const { Schema } = mongoose;

const ingredientCategoryschema = new Schema(
  {
    ingredientCategoryName: { type: String },
    description: { type: String },
    ingredientId: [{ type: Schema.Types.ObjectId, ref: 'Ingredient' }],
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("IngredientCategory", ingredientCategoryschema);
