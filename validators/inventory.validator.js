// inventoryValidation.js
import Joi from '@hapi/joi';

// Validate the inventory data
export function validateCreateInventory(inventoryData) {
  const Inventoryeschema = Joi.object({
    inventoryName: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string(),
    companyId: Joi.string().required()
  });


  const { error } = Inventoryeschema.validate(inventoryData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateInventory(updateData) {
  const Inventoryeschema = Joi.object({
    inventoryName: Joi.string().optional(),
    location: Joi.string().optional(),
    description: Joi.string().optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = Inventoryeschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}