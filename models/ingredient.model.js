import mongoose from "mongoose";

const { Schema } = mongoose;

const ingredientschema = new Schema(
  {
    ingredientName: { type: String },
    ingredientCode: { type: String },
    ingredientCategoryId: { type: Schema.Types.ObjectId, ref: 'IngredientCategory' },
    consumptionUnitId: { type: Schema.Types.ObjectId, ref: 'IngredientUnit' },
    conversionUnit: { type: String },
    purchaseRate: { type: Number, default: 0 },
    costUnit: { type: Number, default: 0 },
    lowQty: { type: Number, default: 0 },
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier' },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Ingredient", ingredientschema);
