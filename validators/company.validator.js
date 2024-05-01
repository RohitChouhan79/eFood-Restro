// companyValidation.js
import Joi from '@hapi/joi';

// Validate the company data
export function validateCreateCompany(companyData) {
  const companySchema = Joi.object({
  companyName: Joi.string().required(),
  contactNumber: Joi.number().required(),
  address: Joi.object({
    streetName: Joi.string().required(),
    landMark: Joi.string().required(),
    city: Joi.string().required(),
    pinCode: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
  emailAddress: Joi.string().email().required(),
  password: Joi.string().required(),
  gstNo: Joi.string().max(16).required(),
  ownerName: Joi.string().required(),
  companyLogo: Joi.string().required(),
  brand: Joi.string().required()
  });


  const { error } = companySchema.validate(companyData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return {error};
}

// Validate the update data
export function validateUpdateCompany(updateData) {
  const companySchema = Joi.object({
  companyName: Joi.string().optional(),
  contactNumber: Joi.number().optional(),
  address: Joi.object({
    streetName: Joi.string().optional(),
    landMark: Joi.string().optional(),
    city: Joi.string().optional(),
    pinCode: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional(),
  }).optional(),
  emailAddress: Joi.string().email().optional(),
  password: Joi.string().optional(),
  gstNo: Joi.string().max(16).optional(),
  ownerName: Joi.string().optional(),
  companyLogo: Joi.string().optional(),
  brand: Joi.string().optional(),
  is_active: Joi.boolean().optional()
  });
  
  const { error } = companySchema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return {error};
}