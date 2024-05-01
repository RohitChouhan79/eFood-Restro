// foodMenuValidation.js
import Joi from '@hapi/joi';

// Validate the foodMenu data
export function validateCreateFoodMenu(foodMenuData) {
  const foodMenuschema = Joi.object({
    foodMenuName: Joi.string().required(),
    foodMenuNameCode: Joi.string().optional(),
    subCategoryId: Joi.string().required(), // Assuming subCategory is required and should be a string
    foodMenuPrice: Joi.number().required(),
    veriationId: Joi.array().optional(),
    description: Joi.string().optional(),
    foodImage: Joi.string().optional(),
    isbeverages: Joi.string().optional(),
    cuisineId: Joi.string().required(),
    subCategoryId: Joi.string().required(),
    ingredientConsumptionId: Joi.string().required(),
    foodMenuStock: Joi.object({
      stockType: Joi.string().optional(),
      stockNumber: Joi.number().optional()
    }),
    isItVeg: Joi.boolean().optional()
  });


  const { error } = foodMenuschema.validate(foodMenuData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateFoodMenu(updateData) {
  const foodMenuschema = Joi.object({
    foodMenuName: Joi.string().optional(),
    foodMenuPrice: Joi.string().optional(),
    veriationId: Joi.array().optional(),
    description: Joi.string().optional(),
    foodImage: Joi.string().optional(),
    isbeverages: Joi.string().optional(),
    isItVeg: Joi.boolean().optional(),
    foodMenuStock: Joi.object({
      stockType: Joi.string().optional(),
      stockNumber: Joi.number().optional()
    }),
    is_active: Joi.boolean().optional()
  });

  const { error } = foodMenuschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}