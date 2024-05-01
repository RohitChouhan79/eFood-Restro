// veriationValidation.js
import Joi from '@hapi/joi';

// Validate the veriation data
export function validateCreateVeriation(veriationData) {
  const veriationschema = Joi.object({
    veriationName: Joi.string().required(),
    foodMenuId: Joi.string().optional(),
    addOnId: Joi.array().required(),
    dineInPrice: Joi.number().optional(),
    takeAwayPrice: Joi.number().optional(),
  });


  const { error } = veriationschema.validate(veriationData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateVeriation(updateData) {
  const veriationschema = Joi.object({
    veriationName: Joi.string().optional(),
    dineInPrice: Joi.number().optional(),
    takeAwayPrice: Joi.number().optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = veriationschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}