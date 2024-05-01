// stockAdjustmentValidation.js
import Joi from '@hapi/joi';

// Validate the stockAdjustment data
export function validateCreateStockAdjustment(stockAdjustmentData) {

  // Define possible values for adjustmentType
  const adjustmentTypeOptions = ['Restock', 'Sale', 'Damage', 'Transfer', 'Expiry', 'Promotion'];

  // Joi schema for stock adjustment
  const stockAdjustmentschema = Joi.object({
    branchStockId: Joi.string().required(),
    adjustmentType: Joi.string().valid(...adjustmentTypeOptions).required(),
    quantityChange: Joi.number().required(),
  });


  const { error } = stockAdjustmentschema.validate(stockAdjustmentData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateStockAdjustment(updateData) {

  // Define possible values for adjustmentType
  const adjustmentTypeOptions = ['Restock', 'Sale', 'Damage', 'Transfer', 'Expiry', 'Promotion'];

  // Joi schema for stock adjustment
  const stockAdjustmentschema = Joi.object({
    adjustmentType: Joi.string().valid(...adjustmentTypeOptions).optional(),
    quantityChange: Joi.number().optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = stockAdjustmentschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}