// employeeValidation.js
import Joi from '@hapi/joi';

// Validate the employee data
export function validateCreateEmployee(employeeData) {
  const Employeeeschema = Joi.object({
    branchId: Joi.string().required(),
    employeeName: Joi.string().required(),
    roleId: Joi.string().required(),
    employeeType: Joi.string().optional(),
    emailAddress: Joi.string().email().required(),
    password: Joi.string().required(),
    contactNumber: Joi.string().required(),
    identityType: Joi.string().valid('Driving License', 'Aadhar Card').required(),
    identityNumber: Joi.string().required(),
    identityImage: Joi.string().optional(),
     // address: Joi.object({
    //   streetName: Joi.string().required(),
    //   landMark: Joi.string().required(),
    //   city: Joi.string().required(),
    //   pinCode: Joi.string().required(),
    //   state: Joi.string().required(),
    //   country: Joi.string().required()
    // }).required(),
    Deliveryman: Joi.array().items(Joi.object({
      deliveryPartnerId: Joi.string().required(),
      requestStatus: Joi.string().optional()
    })).optional()
  });


  const { error } = Employeeeschema.validate(employeeData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateEmployee(updateData) {
  const Employeeeschema = Joi.object({
    branchId: Joi.string().optional(),
    employeeType: Joi.string().optional(),
    employeeName: Joi.string().optional(),
    roleId: Joi.string().optional(),
    emailAddress: Joi.string().email().optional(),
    password: Joi.string().optional(),
    contactNumber: Joi.string().optional(),
    identityType: Joi.string().valid('Driving License', 'Aadhar Card').optional(),
    identityNumber: Joi.string().optional(),
    identityImage: Joi.string().optional(),
    // address: Joi.object({
    //   streetName: Joi.string().optional(),
    //   landMark: Joi.string().optional(),
    //   city: Joi.string().optional(),
    //   pinCode: Joi.string().optional(),
    //   state: Joi.string().optional(),
    //   country: Joi.string().optional()
    // }).optional(),
    Deliveryman: Joi.array().items(Joi.object({
      deliveryPartnerId: Joi.array().optional(),
      requestStatus: Joi.string().optional()
    })).optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = Employeeeschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}