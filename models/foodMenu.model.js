import mongoose from "mongoose";

const { Schema } = mongoose;

const foodMenuschema = new Schema(
  {
    foodMenuName: { type: String, },
    foodMenuNameCode: { type: String },
    cuisineId: { type: Schema.Types.ObjectId, ref: 'Cuisine' },
    subCategoryId: {  type: Schema.Types.ObjectId, ref: 'FoodCategory' },
    ingredientConsumptionId: { type: Schema.Types.ObjectId, ref: 'IngredientUnit' },
    foodMenuPrice: { type: Number, default: 0 },
    veriationId: [{ type: Schema.Types.ObjectId, ref: 'Veriation' }],
    description: { type: String },
    foodImage: { type: String },
    isItVeg: { type: Boolean, default: true },
    isbeverages: { type: String },
    foodMenuStock: {
      stockType: { type: String, default: 'unlimited', enum: ['unlimited', 'fixed', 'daily'] },
      stockNumber: { type: Number }
    },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("FoodMenu", foodMenuschema);
