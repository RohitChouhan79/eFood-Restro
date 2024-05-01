// rolePermissionValidation.js
import Joi from '@hapi/joi';

// Validate the rolePermission data
export function validateCreateRolePermission(rolePermissionData) {
  const RolePermissioneschema = Joi.object({
    roleName: Joi.string().required(),
    DashboardManagement: Joi.boolean().default(false),
    PosManagement: Joi.boolean().default(false),
    OrderManagement: Joi.boolean().default(false),
    ProductManagement: Joi.boolean().default(false),
    PromotionManagement: Joi.boolean().default(false),
    HelpAndSupportManagement: Joi.boolean().default(false),
    ReportAndAnalyticsManagement: Joi.boolean().default(false),
    UserManagement: Joi.boolean().default(false),
    TableManagement: Joi.boolean().default(false),
    SystemManagement: Joi.boolean().default(false)
  });


  const { error } = RolePermissioneschema.validate(rolePermissionData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}

// Validate the update data
export function validateUpdateRolePermission(updateData) {
  const RolePermissioneschema = Joi.object({
    roleName: Joi.string(),
    DashboardManagement: Joi.boolean().default(false),
    PosManagement: Joi.boolean().default(false),
    OrderManagement: Joi.boolean().default(false),
    ProductManagement: Joi.boolean().default(false),
    PromotionManagement: Joi.boolean().default(false),
    HelpAndSupportManagement: Joi.boolean().default(false),
    ReportAndAnalyticsManagement: Joi.boolean().default(false),
    UserManagement: Joi.boolean().default(false),
    TableManagement: Joi.boolean().default(false),
    SystemManagement: Joi.boolean().default(false),
    is_active: Joi.boolean().optional()
  });

  const { error } = RolePermissioneschema.validate(updateData);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    throw new Error(errorMessage);
  }
  return { error };
}