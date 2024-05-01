import CartModel from "../models/cart.model.js";
import { validateCreateCart, validateUpdateCart } from '../validators/cart.validator.js';

// Cart New
export async function insertCart(req, res) {
  try {
      const cartData = req.body;
      console.log("cartData", cartData);

      // Validate cart data before insertion
      const { error } = validateCreateCart(cartData);
      if (error) {
          return res.status(400).json({ error: error.message });
      }

      // Insert cart with itemId
      const newCart = new CartModel(cartData);
      const savedCart = await newCart.save();

      // Send Response
      res.status(200).json({ message: "Cart data inserted", datashow: savedCart });
  } catch (error) {
      return res
          .status(500)
          .json({
              success: false,
              message: error.message || "Something went wrong",
          });
  }
}

// Cart List
export async function showAllCarts(req, res) {
  try {
    const cart = await CartModel.find({ is_active: "true" }).select('-password');

    if (!cart || cart.length === 0) {
      console.log("Cart not found");
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single Cart
export async function showCart(req, res) {
  try {
    const cartId = req.params.id; // Corrected variable name
    const cart = await CartModel.findOne({ _id: cartId }).populate('items.foodMenu'); // Corrected field name
    // const id = req.params.id; // Corrected variable name
    // const cart = await CartModel.find({ _id: id }); // Corrected field name
    console.log(cart);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Update Cart
export async function updateCart(req, res) {
  try {
    const cartId = req.params.id;
    const cartDataToUpdate = req.body;

    // Validate cart data before update
    const { error } = validateUpdateCart(cartDataToUpdate);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get the existing cart by cartId
    const existingCart = await CartModel.findOne({ _id: cartId });
    if (!existingCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Update cart fields
    Object.assign(existingCart, cartDataToUpdate);
    const updatedCart = await existingCart.save();

    // Send the updated cart as JSON response
    res.status(200).json({ message: "Cart updated successfully", cart: updatedCart });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

// Delete Cart
export async function deleteCart(req, res, next) {
  try {
    const cartId = req.params.id;
    const updatedCart = await CartModel.findByIdAndDelete(
      { _id: cartId },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}


// Delete foodMenu
export async function deleteFoodMenu(req, res, next){
  try {
    const cartId = req.params.cartId;
    console.log("cartId", cartId);
    const foodMenu = req.params.foodMenu;
    console.log("foodMenu", foodMenu);

    // Find the cart by ID
    const cart = await CartModel.findById(cartId);
    console.log("cart", cart);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    // Check if the foodMenu exists in the cart
    const foodMenuIndex = cart.items.findIndex(items => items.foodMenu.toString() === foodMenu);
    console.log("foodMenuIndex", foodMenuIndex);

    if (foodMenuIndex === -1) {
      return res.status(404).json({ message: "FoodMenu not found in the cart." });
    }

    // Remove the foodMenu from the items array
    cart.items.splice(foodMenuIndex, 1);

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "FoodMenu deleted from cart successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }

};
