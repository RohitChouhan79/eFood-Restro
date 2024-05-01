// branchStockValidation.js
import Joi from '@hapi/joi';

// Validate the branchStock data
export function validateCreateBranchStock(branchStockData) {
  const BranchStockSchema = Joi.object({
    branchId: Joi.string().required(),
    items: Joi.string().required(),
    qty: Joi.number().required(),
    flag: Joi.string().allow('').optional()
  });


  const { error } = BranchStockSchema.validate(branchStockData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateBranchStock(updateData) {
  const BranchStockSchema = Joi.object({
    items: Joi.string().optional(),
    qty: Joi.number().optional(),
    flag: Joi.string().allow('').optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = BranchStockSchema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}