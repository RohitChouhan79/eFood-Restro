import mongoose from "mongoose";

const { Schema } = mongoose;

const paymentModeEnum = {
  DEBITCARD: "Debit Card",
  CREDITCARD: "Credit Card",
  CASH: "Cash",
  UPI: "Upi",
  BANKTRANSFER: "BankTransfer"
};

const purchaseschema = new Schema(
  {
    inventoryId: { type: Schema.Types.ObjectId, ref: "Inventory" },
    supplierId: { type: Schema.Types.ObjectId, ref: "Supplier" },
    paymentMode: { type: String, enum: Object.values(paymentModeEnum) },
    grandTotal: { type: Number, default: 0 },
    amountDue: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    invoiceNumber: { type: String },
    is_active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate invoice number
purchaseschema.pre('save', async function(next) {
  try {
    if (!this.invoiceNumber) {
      // Generate your unique invoice number logic here
      // For simplicity, let's say it's a combination of static text and a random number
      const randomInvoiceNumber = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
      this.invoiceNumber = randomInvoiceNumber;
    }
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("Purchase", purchaseschema);
