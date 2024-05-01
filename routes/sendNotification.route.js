import express from "express";
import * as sendNotification from '../controllers/sendNotification.controller.js';

const router = express.Router();

// Route for creating a new sendNotification
router.post("/", sendNotification.insertSendNotification);
// router.post("/", sendNotification.sendNotificationEmailToCustomers);

// Route for getting all sendNotifications
router.get("/", sendNotification.showAllSendNotifications);

// Route for getting a sendNotification by ID
router.get("/:id", sendNotification.showSendNotification);

// Route for updating a sendNotification
router.put("/:id", sendNotification.updateSendNotification);

// Route for deleting a sendNotification
router.delete("/:id", sendNotification.deleteSendNotification);

// Search sendNotification
router.get('/sendNotifications/search', sendNotification.searchSendNotification);

export default router;
