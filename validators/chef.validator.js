// chefValidation.js
import Joi from '@hapi/joi';

// Validate the chef data
export function validateCreateChef(chefData) {
  const Chefeschema = Joi.object({
    branchId: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    identityType: Joi.string().valid('Driving License', 'Aadhar Card').required(),
    identityNumber: Joi.string().required(),
    identityImage: Joi.string().optional(),
    emailAddress: Joi.string().email().required(),
    password: Joi.string().required(),
    contactNumber: Joi.string().required(),
    address: Joi.optional({
      streetName: Joi.string().optional(),
      landMark: Joi.string().optional(),
      city: Joi.string().optional(),
      pinCode: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().optional()
    }).optional(),
    profile: Joi.string().optional()
  });


  const { error } = Chefeschema.validate(chefData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateChef(updateData) {
  const Chefeschema = Joi.object({
    branchId: Joi.array().optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    identityType: Joi.string().valid('Driving License', 'Aadhar Card').optional(),
    identityNumber: Joi.string().optional(),
    identityImage: Joi.string().optional(),
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

  const { error } = Chefeschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}