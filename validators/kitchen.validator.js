// kitchenValidation.js
import Joi from '@hapi/joi';

// Validate the kitchen data
export function validateCreateKitchen(kitchenData) {
  const kitchenschema = Joi.object({
    branchId: Joi.string().required(),
    kitchenName: Joi.string().required(),
    kitchenArea: Joi.string().required()
  });


  const { error } = kitchenschema.validate(kitchenData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateKitchen(updateData) {
  const kitchenschema = Joi.object({
    branchId: Joi.array().optional(),
    kitchenName: Joi.string().optional(),
    kitchenCode: Joi.string().optional(),
    kitchenArea: Joi.string().optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = kitchenschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}