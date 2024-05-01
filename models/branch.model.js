import mongoose from "mongoose";

const { Schema } = mongoose;

const Brancheschema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    areaId: { type: Schema.Types.ObjectId, ref: 'Area' },
    branchName: { type: String },
    branchCode: { type: String },
    contactNumber: { type: String },
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
    ownerName: { type: String },
    gstNo: { type: String },
    branchType: { type: String, enum: ['Kiosk', 'Compact', 'Standalone', 'Lounge'] },
    brandLogo: { type: String }, // Assuming you store the file path
    openingTime: { type: Date }, // Use Date type for openingTime
    closingTime: { type: Date }, // Use Date type for closingTime
    Deliveryman: [{
      deliveryPartnerId: { type: Schema.Types.ObjectId, ref: 'DeliveryPartner' },
      requestStatus: { type: String, enum: ['Accept', 'Pending', 'Denied'], default: 'Pending' }
    }],
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Branch", Brancheschema);
