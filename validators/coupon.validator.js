// couponValidation.js
import Joi from '@hapi/joi';

// Validate the coupon data
export function validateCreateCoupon(couponData) {
  const Couponeschema = Joi.object({
    couponTitle: Joi.string().required(),
    couponCode: Joi.string().optional(),
    couponType: Joi.string().optional(),
    discountType: Joi.string().optional(),
    discountPercent: Joi.number().required(),
    minimumPurchase: Joi.number().required(),
    maximumDiscount: Joi.number().optional(),
    startDate: Joi.date().iso().required(),
    expiryDate: Joi.date().iso().required(),
    userLimit: Joi.number().optional(),
    userLimitCount: Joi.number().optional(),
    customerId: Joi.string().required()
  });


  const { error } = Couponeschema.validate(couponData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateCoupon(updateData) {
  const Couponeschema = Joi.object({
    couponType: Joi.string().optional(),
    discountType: Joi.string().optional(),
    discountPercent: Joi.number().optional(),
    minimumPurchase: Joi.number().optional(),
    maximumDiscount: Joi.number().optional(),
    startDate: Joi.date().iso().optional(),
    expiryDate: Joi.date().iso().optional(),
    userLimit: Joi.number().optional(),
    userLimitCount: Joi.number().optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = Couponeschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}