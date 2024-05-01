import mongoose from "mongoose";

const { Schema } = mongoose;

const sendNotificationschema = new Schema(
  {
    title: { type: String, },
    description: { type: String },
    banner: { type: String },
    emailAddresses: { type: Array },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("SendNotification", sendNotificationschema);
