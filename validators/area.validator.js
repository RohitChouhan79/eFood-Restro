// areaValidation.js
import Joi from '@hapi/joi';

// Validate the area data
export function validateCreateArea(areaData) {
  const Areaeschema = Joi.object({
    areaName: Joi.string().required(),
    description: Joi.string().required(),
    // address: Joi.object({
    //   streetName: Joi.string().required(),
    //   landMark: Joi.string().required(),
    //   city: Joi.string().required(),
    //   pinCode: Joi.string().required(),
    //   state: Joi.string().required(),
    //   country: Joi.string().required(),
    // }).required()
  });


  const { error } = Areaeschema.validate(areaData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateArea(updateData) {
  const Areaeschema = Joi.object({
    areaName: Joi.string().optional(),
    description: Joi.string().optional(),
    // address: Joi.object({
    //   streetName: Joi.string().optional(),
    //   landMark: Joi.string().optional(),
    //   city: Joi.string().optional(),
    //   pinCode: Joi.string().optional(),
    //   state: Joi.string().optional(),
    //   country: Joi.string().optional(),
    // }).optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = Areaeschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}