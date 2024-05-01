import express from "express";
import * as cart from '../controllers/cart.controller.js';

const router = express.Router();

// Route for creating a new cart
router.post("/", cart.insertCart);

// Route for getting all carts
router.get("/", cart.showAllCarts);

// Route for getting a cart by ID
router.get("/:id", cart.showCart);

// Route for updating a cart
router.put("/:id", cart.updateCart);

// Route for deleting a cart
router.delete("/:id", cart.deleteCart);

/* Delete */
router.delete('/:cartId/foodMenu/:foodMenu', cart.deleteFoodMenu);

export default router;
