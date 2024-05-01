// cartValidation.js
import Joi from '@hapi/joi';

// Validate the cart data
export function validateCreateCart(cartData) {
  const cartschema = Joi.object({
    employeeId: Joi.string().required(),
    items: Joi.array().items(Joi.object({
      foodMenu: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required()
    })).required(),
    totalItemsCount: Joi.number().integer().min(0).required(),
    totalPrice: Joi.number().min(0).required()
  });


  const { error } = cartschema.validate(cartData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateCart(updateData) {
  const cartschema = Joi.object({
    employeeId: Joi.array().optional(),
    items: Joi.array().items(Joi.object({
      foodMenu: Joi.string().optional(),
      quantity: Joi.number().integer().min(1).optional()
    })).optional(),
    totalItemsCount: Joi.number().integer().min(0).optional(),
    totalPrice: Joi.number().min(0).optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = cartschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}