// purchaseValidation.js
import Joi from '@hapi/joi';

const paymentModeEnum = ['Debit Card', 'Credit Card', 'Cash', 'Upi', 'BankTransfer'];
// Validate the purchase data
export function validateCreatePurchase(purchaseData) {
  const purchaseschema = Joi.object({
    inventoryId: Joi.string().required(),
    supplierId: Joi.string().required(),
    paymentMode: Joi.string().valid(...paymentModeEnum).required(),
    grandTotal: Joi.number().optional(),
    amountDue: Joi.number().optional(),
    amountPaid: Joi.number().optional()
  });


  const { error } = purchaseschema.validate(purchaseData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdatePurchase(updateData) {
  const purchaseschema = Joi.object({
    paymentMode: Joi.string().valid(...paymentModeEnum).optional(),
    grandTotal: Joi.number().optional(),
    amountDue: Joi.number().optional(),
    amountPaid: Joi.number().optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = purchaseschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}