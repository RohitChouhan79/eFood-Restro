import mongoose from "mongoose";

const { Schema } = mongoose;

const Areaeschema = new Schema(
  {
    areaName: { type: String },
    description: { type: String },
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
export default mongoose.model("Area", Areaeschema);
