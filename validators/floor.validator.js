// floorValidation.js
import Joi from '@hapi/joi';

// Validate the floor data
export function validateCreateFloor(floorData) {
  const floorschema = Joi.object({
    branchId: Joi.string().required(),
    sectionName: Joi.string().required(),
    description: Joi.string().allow('').required()
  });


  const { error } = floorschema.validate(floorData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateFloor(updateData) {
  const floorschema = Joi.object({
    branchId: Joi.array().optional(),
    floorNumber: Joi.number().integer().optional(),
    sectionName: Joi.string().optional(),
    description: Joi.string().allow('').optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = floorschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}