// ingredientCategoryValidation.js
import Joi from '@hapi/joi';

// Validate the ingredientCategory data
export function validateCreateIngredientCategory(ingredientCategoryData) {
  const ingredientCategoryschema = Joi.object({
    ingredientCategoryName: Joi.string().required(),
    description: Joi.string().required(),
    ingredientId: Joi.array().optional()
  });


  const { error } = ingredientCategoryschema.validate(ingredientCategoryData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateIngredientCategory(updateData) {
  const ingredientCategoryschema = Joi.object({
    ingredientCategoryName: Joi.string().optional(),
    description: Joi.string().optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = ingredientCategoryschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}