// billingValidation.js
import Joi from '@hapi/joi';

// Validate the billing data
export function validateCreateBilling(billingData) {
  const billingschema = Joi.object({
    orderId: Joi.string().required(),
    couponId: Joi.string().optional(),
    particulars: Joi.array().items(Joi.object({
      foodMenuId: Joi.string().required(),
      quantity: Joi.number().required(),
      rate: Joi.number().required(),
      amount: Joi.number().required()
    })),
    subTotal: Joi.number().min(0).default(0),
    CGST: Joi.number().min(0).default(0),
    SGST: Joi.number().min(0).default(0),
    finalTotal: Joi.number().min(0).default(0),
    paymentStatus: Joi.string().optional(),
    gstNo: Joi.string().max(16)
  });


  const { error } = billingschema.validate(billingData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateBilling(updateData) {
  const billingschema = Joi.object({
    orderId: Joi.array().optional(),
    particulars: Joi.array().items(Joi.object({
      foodMenuId: Joi.array().optional(),
      quantity: Joi.number().optional(),
      rate: Joi.number().optional(),
      amount: Joi.number().optional()
    })),
    subTotal: Joi.number().min(0).default(0).optional(),
    CGST: Joi.number().min(0).default(0).optional(),
    SGST: Joi.number().min(0).default(0).optional(),
    finalTotal: Joi.number().min(0).default(0).optional(),
    gstNo: Joi.string().max(16).optional(),
    paymentStatus: Joi.string().optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = billingschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}