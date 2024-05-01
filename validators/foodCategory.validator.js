// foodCategoryValidation.js
import Joi from '@hapi/joi';

// Validate the foodCategory data
export function validateCreateFoodCategory(foodCategoryData) {
  const foodCategoryschema = Joi.object({
    foodCategoryName: Joi.string().required(),
    foodMenuId: Joi.array().optional(),
    description: Joi.string().allow('').required()
  });


  const { error } = foodCategoryschema.validate(foodCategoryData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateFoodCategory(updateData) {
  const foodCategoryschema = Joi.object({
    foodCategoryName: Joi.string().optional(),
    description: Joi.string().allow('').optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = foodCategoryschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}