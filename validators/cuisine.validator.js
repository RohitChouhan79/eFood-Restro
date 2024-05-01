// cuisineValidation.js
import Joi from '@hapi/joi';

// Validate the cuisine data
export function validateCreateCuisine(cuisineData) {
  const cuisineschema = Joi.object({
    cuisineName: Joi.string().required(),
    foodMenuId: Joi.array().optional(),
    description: Joi.string().allow('').required()
  });


  const { error } = cuisineschema.validate(cuisineData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateCuisine(updateData) {
  const cuisineschema = Joi.object({
    cuisineName: Joi.string().optional(),
    description: Joi.string().allow('').optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = cuisineschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}