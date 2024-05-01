import mongoose from "mongoose";

const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    ingredientUnitId: { type: Schema.Types.ObjectId, ref: 'IngredientUnit' },
    description: { type: String },
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee' },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Payment", paymentSchema);
