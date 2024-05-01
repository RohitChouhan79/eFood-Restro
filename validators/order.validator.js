// orderValidation.js
import Joi from '@hapi/joi';

// Validate the order data
export function validateCreateOrder(orderData) {
  const orderschema = Joi.object({
    branchId: Joi.string().required(), // Assuming Customer ID is a string
    customerId: Joi.string().required(), // Assuming Customer ID is a string
    waiterId: Joi.string().optional(),
    deliveryManId: Joi.string().required(),
    orderNumber: Joi.number().optional(), // Assuming Waiter ID is a string
    orderCode: Joi.string().optional(),
    orderType: Joi.string(),
    tableId: Joi.string().optional(), // Assuming Order ID is a string
    KOTId: Joi.array().items(Joi.string()), // Assuming KOT IDs are strings and can be an array
    totalOrderPrice: Joi.number().required(),
    orderStatus: Joi.string().optional()
  });


  const { error } = orderschema.validate(orderData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateOrder(updateData) {
  const orderschema = Joi.object({
    orderType: Joi.string().optional(),
    totalOrderPrice: Joi.number().optional(),
    orderStatus: Joi.string().optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = orderschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}