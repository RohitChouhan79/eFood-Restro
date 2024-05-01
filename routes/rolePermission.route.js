import express from "express";
import * as rolePermission from '../controllers/rolePermission.controller.js';

const router = express.Router();

// Route for creating a new rolePermission
router.post("/", rolePermission.insertRolePermission);

// Route for getting all rolePermissions
router.get("/", rolePermission.showAllRolePermissions);

// Route for getting a rolePermission by ID
router.get("/:id", rolePermission.showRolePermission);

// Route for updating a rolePermission
router.put("/:id", rolePermission.updateRolePermission);

// Route for deleting a rolePermission
router.delete("/:id", rolePermission.deleteRolePermission);

export default router;
