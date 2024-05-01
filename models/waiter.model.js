import mongoose from "mongoose";

const { Schema } = mongoose;

const waiterSchema = new Schema(
  {
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
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
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Waiter", waiterSchema);
