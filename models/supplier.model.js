import mongoose from "mongoose";

const { Schema } = mongoose;

const supplierSchema = new Schema(
  {
    supplierName: { type: String },
    emailAddress: { type: String },
    contactNumber: { type: String },
    // address: {
    //   streetName: { type: String },
    //   landMark: { type: String },
    //   city: { type: String },
    //   pinCode: { type: String },
    //   state: { type: String },
    //   country: { type: String },
    // },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Supplier", supplierSchema);
