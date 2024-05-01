// waiterValidation.js
import Joi from '@hapi/joi';

// Validate the waiter data
export function validateCreateWaiter(waiterData) {
  const Waitereschema = Joi.object({
    branchId: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
    password: Joi.string().required(),
    contactNumber: Joi.string().required(),
     // address: Joi.object({
    //   streetName: Joi.string().required(),
    //   landMark: Joi.string().required(),
    //   city: Joi.string().required(),
    //   pinCode: Joi.string().required(),
    //   state: Joi.string().required(),
    //   country: Joi.string().required()
    // }).required(),
    profile: Joi.string().optional()
  });


  const { error } = Waitereschema.validate(waiterData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateWaiter(updateData) {
  const Waitereschema = Joi.object({
    branchId: Joi.array().optional(),
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
    is_active: Joi.boolean().optional()
  });

  const { error } = Waitereschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}