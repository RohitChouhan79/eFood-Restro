// purchaseItemValidation.js
import Joi from '@hapi/joi';

// Validate the purchaseItem data
export function validateCreatePurchaseItem(purchaseItemData) {
  const PurchaseItemeschema = Joi.object({
    purchaseId: Joi.string().required(),
    itemId: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
    unitOfMeasurement: Joi.string().required().max(50),
    price: Joi.number().required(),
    modifiedBy: Joi.string().required()
  });


  const { error } = PurchaseItemeschema.validate(purchaseItemData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdatePurchaseItem(updateData) {
  const PurchaseItemeschema = Joi.object({
    quantity: Joi.number().min(1).optional(),
    unitOfMeasurement: Joi.string().optional().max(50),
    price: Joi.number().optional(),
    modifiedBy: Joi.string().optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = PurchaseItemeschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}