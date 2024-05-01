// customerValidation.js
import Joi from '@hapi/joi';

// Validate the customer data
export function validateCreateCustomer(customerData) {
  const Customereschema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
    password: Joi.string().required(),
    contactNumber: Joi.string().required(),
    foodMenuId: Joi.array().optional(),
     // address: Joi.object({
    //   streetName: Joi.string().required(),
    //   landMark: Joi.string().required(),
    //   city: Joi.string().required(),
    //   pinCode: Joi.string().required(),
    //   state: Joi.string().required(),
    //   country: Joi.string().required()
    // }).required(),
    wallet: Joi.string().optional(),
    profile: Joi.string().optional()
  });


  const { error } = Customereschema.validate(customerData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateCustomer(updateData) {
  const Customereschema = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    emailAddress: Joi.string().email().optional(),
    password: Joi.string().optional(),
    contactNumber: Joi.string().optional(),
    // address: Joi.object({
    //   streetName: Joi.string().optional(),
    //   landMark: Joi.string().optional(),
    //   city: Joi.string().optional(),
    //   pinCode: Joi.string().optional(),
    //   state: Joi.string().optional(),
    //   country: Joi.string().optional()
    // }).optional(),
    profile: Joi.string().optional(),
    wallet: Joi.string().optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = Customereschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}