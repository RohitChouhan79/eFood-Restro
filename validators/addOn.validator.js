// addOnValidation.js
import Joi from '@hapi/joi';

// Validate the addOn data
export function validateCreateAddOn(addOnData) {
  const addOnschema = Joi.object({
    addOnName: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().optional(),
  veriationId: Joi.array().optional()
  });


  const { error } = addOnschema.validate(addOnData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateAddOn(updateData) {
  const addOnschema = Joi.object({
    addOnName: Joi.string().optional(),
  price: Joi.number().optional(),
  description: Joi.string().optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = addOnschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}