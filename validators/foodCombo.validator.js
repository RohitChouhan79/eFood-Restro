// foodComboValidation.js
import Joi from '@hapi/joi';

// Validate the foodCombo data
export function validateCreateFoodCombo(foodComboData) {
  const foodComboschema = Joi.object({
    foodComboName: Joi.string().required(),
    foodComboNameCode: Joi.string().required(),
    foodMenuId: Joi.string().alphanum().required(),
    foodCategoryId: Joi.string().alphanum().required(),
    dineInPrice: Joi.string().required(),
    takeAwayPrice: Joi.string().required(),
    deliveryPrice: Joi.string().alphanum().required(),
    description: Joi.string().required(),
    isItVeg: Joi.boolean().optional(),
    branchId: Joi.string().alphanum().required()
  });


  const { error } = foodComboschema.validate(foodComboData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateFoodCombo(updateData) {
  const foodComboschema = Joi.object({
    foodComboName: Joi.string().optional(),
    foodComboNameCode: Joi.string().optional(),
    foodMenuId: Joi.string().alphanum().optional(),
    foodCategoryId: Joi.string().alphanum().optional(),
    dineInPrice: Joi.string().optional(),
    takeAwayPrice: Joi.string().optional(),
    deliveryPrice: Joi.string().alphanum().optional(),
    description: Joi.string().optional(),
    isItVeg: Joi.boolean().optional(),
    branchId: Joi.string().alphanum().optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = foodComboschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}