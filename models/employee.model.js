import mongoose from "mongoose";

const { Schema } = mongoose;

const employeeSchema = new Schema(
  {
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    roleId: { type: Schema.Types.ObjectId, ref: 'RolePermission' },
    employeeType: { type: String, enum: ['Staff', 'Admin'], default: 'Staff' },
    employeeName: { type: String },
    emailAddress: { type: String },
    password: { type: String },
    contactNumber: { type: String },
    identityType: { type: String, enum: ['Driving License', 'Aadhar Card'] },
    identityNumber: { type: String},
    identityImage: { type: String },
    // address: {
    //   streetName: { type: String },
    //   landMark: { type: String },
    //   city: { type: String },
    //   pinCode: { type: String },
    //   state: { type: String },
    //   country: { type: String },
    // },
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
export default mongoose.model("Employee", employeeSchema);
