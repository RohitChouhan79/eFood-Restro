// tableValidation.js
import Joi from '@hapi/joi';

// Validate the table data
export function validateCreateTable(tableData) {
  const tableschema = Joi.object({
    branchId: Joi.string().required(),
    occupiedTable: Joi.string().optional(),
    seatingCapacity: Joi.number().integer().required(),
    description: Joi.string().allow('').required()
  });


  const { error } = tableschema.validate(tableData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateTable(updateData) {
  const tableschema = Joi.object({
    branchId: Joi.array().optional(),
    occupiedTable: Joi.string().optional(),
    tableNumber: Joi.number().integer().optional(),
    seatingCapacity: Joi.number().integer().optional(),
    description: Joi.string().allow('').optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = tableschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}