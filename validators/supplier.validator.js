// supplierValidation.js
import Joi from '@hapi/joi';

// Validate the supplier data
export function validateCreateSupplier(supplierData) {
  const Suppliereschema = Joi.object({
    supplierName: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
    contactNumber: Joi.string().required(),
    address: Joi.object({
      streetName: Joi.string().required(),
      landMark: Joi.string().required(),
      city: Joi.string().required(),
      pinCode: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required()
    }).required()
  });


  const { error } = Suppliereschema.validate(supplierData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateSupplier(updateData) {
  const Suppliereschema = Joi.object({
    supplierName: Joi.string().optional(),
    emailAddress: Joi.string().email().optional(),
    contactNumber: Joi.string().optional(),
    // address: Joi.object({
    //   streetName: Joi.string().optional(),
    //   landMark: Joi.string().optional(),
    //   city: Joi.string().optional(),
    //   pinCode: Joi.string().optional(),
    //   state: Joi.string().optional(),
    //   country: Joi.string().optional()
    // }).optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = Suppliereschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}