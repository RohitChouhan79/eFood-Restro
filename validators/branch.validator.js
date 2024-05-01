// branchValidation.js
import Joi from '@hapi/joi';

// Validate the branch data
export function validateCreateBranch(branchData) {
  const Brancheschema = Joi.object({
    companyId: Joi.string().required(),
    areaId: Joi.string().required(),
    branchName: Joi.string().required(),
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
    ownerName: Joi.string().required(),
    gstNo: Joi.string().max(16).required(),
    branchType: Joi.string().required(),
    brandLogo: Joi.string().required(), // Assuming you store the file path
    openingTime: Joi.date().required(),
    closingTime: Joi.date().required(),
    Deliveryman: Joi.array().items(Joi.object({
      deliveryPartnerId: Joi.string().required(),
      requestStatus: Joi.string().optional()
    })).optional(),
    contactNumber: Joi.string().required()
  });


  const { error } = Brancheschema.validate(branchData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return {error};
}

// Validate the update data
export function validateUpdateBranch(updateData) {
  const Brancheschema = Joi.object({
    companyId: Joi.array().optional(),
    areaId: Joi.array().optional(),
    branchName: Joi.string().optional(),
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
    ownerName: Joi.string().optional(),
    gstNo: Joi.string().max(16).optional(),
    branchType: Joi.string().optional(),
    brandLogo: Joi.string().optional(), // Assuming you store the file path
    openingTime: Joi.date().optional(),
    closingTime: Joi.date().optional(),
    contactNumber: Joi.string().optional(),
    Deliveryman: Joi.array().items(Joi.object({
      deliveryPartnerId: Joi.array().optional(),
      requestStatus: Joi.string().optional()
    })).optional(),
  is_active: Joi.boolean().optional()
  });
  
  const { error } = Brancheschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return {error};
}