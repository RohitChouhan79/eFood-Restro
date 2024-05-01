// modifierValidation.js
import Joi from '@hapi/joi';

// Validate the modifier data
export function validateCreateModifier(modifierData) {
  const modifierschema = Joi.object({
    modifierName: Joi.string().required(),
    salePrice: Joi.number().required(),
    ingredientConsumption: Joi.string(),
    description: Joi.string().required(),
    totalCostOfIngredients: Joi.number().required(),
  });


  const { error } = modifierschema.validate(modifierData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateModifier(updateData) {
  const modifierschema = Joi.object({
    modifierName: Joi.string().optional(),
    salePrice: Joi.number().optional(),
    ingredientConsumption: Joi.string().optional(),
    description: Joi.string().optional(),
    totalCostOfIngredients: Joi.number().optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = modifierschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}