// ingredientUnitValidation.js
import Joi from '@hapi/joi';

// Validate the ingredientUnit data
export function validateCreateIngredientUnit(ingredientUnitData) {
  const ingredientUnitschema = Joi.object({
    ingredientUnitName: Joi.string().required(),
    foodMenuId: Joi.array().optional(),
    description: Joi.string().required(),
    ingredientId: Joi.array().optional()
  });


  const { error } = ingredientUnitschema.validate(ingredientUnitData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateIngredientUnit(updateData) {
  const ingredientUnitschema = Joi.object({
    ingredientUnitName: Joi.string().optional(),
    description: Joi.string().optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = ingredientUnitschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}