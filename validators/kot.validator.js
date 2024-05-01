// kotValidation.js
import Joi from '@hapi/joi';

// Validate the kot data
export function validateCreateKOT(kotData) {
  const KOTschema = Joi.object({
    branchId: Joi.string().required(),
    waiterId: Joi.string().required(),
    tableId: Joi.string().required(),
    orderId: Joi.string().required(),
    items: Joi.array().items(Joi.object({
      foodMenuId: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
      customerComment: Joi.string().allow(null).default(null)
    })).required()
  });


  const { error } = KOTschema.validate(kotData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateKOT(updateData) {
  const KOTschema = Joi.object({
    items: Joi.array().items(Joi.object({
      foodItem: Joi.string().optional(),
      quantity: Joi.number().integer().min(1).optional(),
      customerComment: Joi.string().allow(null).default(null).optional()
    })).optional(),
    typeOfOrder: Joi.string().optional(),
    cookingStatus: Joi.string().optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = KOTschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}