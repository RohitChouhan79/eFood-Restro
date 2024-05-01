// reportValidation.js
import Joi from '@hapi/joi';

// Validate the report data
export function validateCreateReport(reportData) {
  const reportschema = Joi.object({
    cashierId: Joi.string().required(),
  totalSales: Joi.number().required(),
  totalProfit: Joi.number().required(),
  totalTax: Joi.number().default(0),
  totalDiscount: Joi.number().default(0),
  });


  const { error } = reportschema.validate(reportData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateReport(updateData) {
  const reportschema = Joi.object({
    cashierId: Joi.array().optional(),
  totalSales: Joi.number().optional(),
  totalProfit: Joi.number().optional(),
  totalTax: Joi.number().optional(),
  totalDiscount: Joi.number().optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = reportschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}