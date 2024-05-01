// addFundValidation.js
import Joi from '@hapi/joi';

// Validate the addFund data
export function validateCreateAddFund(addFundData) {
  const addFundschema = Joi.object({
    customerId: Joi.string().required(),
    fundAmount: Joi.number().required(),
    referenceName: Joi.string().optional()
  });


  const { error } = addFundschema.validate(addFundData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateAddFund(updateData) {
  const addFundschema = Joi.object({
    customerId: Joi.string().optional(),
    fundAmount: Joi.number().optional(),
    referenceName: Joi.string().optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = addFundschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}