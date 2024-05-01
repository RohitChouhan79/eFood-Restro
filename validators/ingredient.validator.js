// ingredientValidation.js
import Joi from '@hapi/joi';

// Validate the ingredient data
export function validateCreateIngredient(ingredientData) {
  const ingredientschema = Joi.object({
    ingredientName: Joi.string().required(),
    ingredientCategoryId: Joi.string().required(),
    consumptionUnitId: Joi.string().required(),
    conversionUnit: Joi.string().optional(),
    purchaseRate: Joi.number().optional(),
    costUnit: Joi.number().optional(),
    lowQty: Joi.number().optional(),
    supplierId: Joi.string().required()
  });


  const { error } = ingredientschema.validate(ingredientData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateIngredient(updateData) {
  const ingredientschema = Joi.object({
    ingredientName: Joi.string().optional(),
    ingredientCode: Joi.string().optional(),
    ingredientCategoryId: Joi.array().optional(),
    consumptionUnitId: Joi.array().optional(),
    conversionUnit: Joi.string().optional(),
    purchaseRate: Joi.number().optional(),
    costUnit: Joi.number().optional(),
    lowQty: Joi.number().optional(),
    supplierId: Joi.array().optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = ingredientschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}