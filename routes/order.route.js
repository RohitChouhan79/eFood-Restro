import express from "express";
import * as order from '../controllers/order.controller.js';

const router = express.Router();

// Route for creating a new order
router.post("/", order.insertOrder);

// Route for getting all orders
router.get("/", order.showAllOrders);

// Route for getting a order by ID
router.get("/:id", order.showOrder);

// Route for updating a order
router.put("/:id", order.updateOrder);

// Route for deleting a order
router.delete("/:id", order.deleteOrder);

// Route for reset the orderNumber
router.post("/restart-number", order.restartOrderNumber);

// Search order
router.get('/orders/search', order.searchOrder);

export default router;
