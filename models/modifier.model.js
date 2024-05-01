import mongoose from "mongoose";

const { Schema } = mongoose;

const modifierschema = new Schema(
  {
    modifierName: { type: String },
    salePrice: { type: Number, default: 0 },
    ingredientConsumption: { type: Schema.Types.ObjectId, ref: 'Ingredient' },
    description: { type: String },
    totalCostOfIngredients: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Modifier", modifierschema);
