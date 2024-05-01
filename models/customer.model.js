import mongoose from "mongoose";

const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    emailAddress: { type: String },
    password: { type: String },
    contactNumber: { type: String },
    // address: {
    //   streetName: { type: String },
    //   landMark: { type: String },
    //   city: { type: String },
    //   pinCode: { type: String },
    //   state: { type: String },
    //   country: { type: String },
    // },
    profile: { type: String },
    wallet: { type: Number },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Customer", customerSchema);
