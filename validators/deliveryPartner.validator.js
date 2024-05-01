// deliveryPartnerValidation.js
import Joi from '@hapi/joi';

// Validate the deliveryPartner data
export function validateCreateDeliveryPartner(deliveryPartnerData) {
  const DeliveryPartnereschema = Joi.object({
    branchId: Joi.string().required(),
    employeeId: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    identityType: Joi.string().valid('Driving License', 'Aadhar Card').required(),
    identityNumber: Joi.string().required(),
    identityImage: Joi.string().required(),
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
    requestStatus: Joi.string().optional(),
    profile: Joi.string().optional()
  });


  const { error } = DeliveryPartnereschema.validate(deliveryPartnerData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateDeliveryPartner(updateData) {
  const DeliveryPartnereschema = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    identityType: Joi.string().optional(),
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
    requestStatus: Joi.string().optional(),
    profile: Joi.string().optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = DeliveryPartnereschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}