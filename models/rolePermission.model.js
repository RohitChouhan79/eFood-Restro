import mongoose from "mongoose";

const { Schema } = mongoose;

const RolePermissioneschema = new Schema(
  {
    roleName: { type: String },
    DashboardManagement: { type: Boolean, default: false },
    PosManagement: { type: Boolean, default: false },
    OrderManagement: { type: Boolean, default: false },
    ProductManagement: { type: Boolean, default: false },
    PromotionManagement: { type: Boolean, default: false },
    HelpAndSupportManagement: { type: Boolean, default: false },
    ReportAndAnalyticsManagement: { type: Boolean, default: false },
    UserManagement: { type: Boolean, default: false },
    TableManagement: { type: Boolean, default: false },
    SystemManagement: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("RolePermission", RolePermissioneschema);



