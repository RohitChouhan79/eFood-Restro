// InventoryStockStockValidation.js
import Joi from '@hapi/joi';

// Validate the InventoryStockStock data
export function validateCreateInventoryStock(InventoryStockStockData) {
  const inventoryItemSchema = Joi.object({
    itemName: Joi.string().required(),
    totalQuantity: Joi.number().required(),
    unitOfMeasurement: Joi.string().required(),
    alertQuantity: Joi.number().required(),
    minimumQuantity: Joi.number().required()
});
  const InventoryStockeschema = Joi.object({
    inventoryId: Joi.string().required(),
    items: Joi.array().items(inventoryItemSchema).required()
  });


  const { error } = InventoryStockeschema.validate(InventoryStockStockData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateInventoryStock(updateData) {
  const inventoryItemSchema = Joi.object({
    itemName: Joi.string().optional(),
    totalQuantity: Joi.number().optional(),
    unitOfMeasurement: Joi.string().optional(),
    alertQuantity: Joi.number().optional(),
    minimumQuantity: Joi.number().optional()
});
  const InventoryStockschema = Joi.object({
    inventoryId: Joi.array().optional(),
    items: Joi.array().items(inventoryItemSchema).optional(),
    is_active: Joi.boolean().optional()
  });

  const { error } = InventoryStockschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}