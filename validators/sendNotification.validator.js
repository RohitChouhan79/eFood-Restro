// sendNotificationValidation.js
import Joi from '@hapi/joi';

// Validate the sendNotification data
export function validateCreateSendNotification(sendNotificationData) {
  const sendNotificationschema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    banner: Joi.string().required(),
    emailAddresses: Joi.array().optional()
  });


  const { error } = sendNotificationschema.validate(sendNotificationData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateSendNotification(updateData) {
  const sendNotificationschema = Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    banner: Joi.string().optional(),
    emailAddresses: Joi.array().optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = sendNotificationschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}