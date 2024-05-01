import mongoose from "mongoose";

const { Schema } = mongoose;

const companySchema = new Schema(
  {
    companyName: { type: String },
    contactNumber: { type: Number, default: 0 },
    // address: {
    //   streetName: { type: String },
    //   landMark: { type: String },
    //   city: { type: String },
    //   pinCode: { type: String },
    //   state: { type: String },
    //   country: { type: String },
    // },
    emailAddress: { type: String },
    password: { type: String },
    gstNo: { type: String },
    ownerName: { type: String },
    // companyLogo: { type: Object, default: { fileId: "", url: "" } },
    companyLogo: { type: String },
    brand: { type: String },
    is_active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Company", companySchema);
