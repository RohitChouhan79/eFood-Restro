// paymentValidation.js
import Joi from '@hapi/joi';

const paymentModeEnum = ['Debit Card', 'Credit Card', 'Cash', 'Upi', 'BankTransfer'];
// Validate the payment data
export function validateCreatePayment(paymentData) {
  const paymentschema = Joi.object({
    ingredientUnitId: Joi.string().required(),
    description: Joi.string().optional(),
    employeeId: Joi.string().required(),
    branchId: Joi.string().required()
  });


  const { error } = paymentschema.validate(paymentData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdatePayment(updateData) {
  const paymentschema = Joi.object({
    description: Joi.string().optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = paymentschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}