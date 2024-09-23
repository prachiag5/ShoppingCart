import Cart from '../models/cart.mjs';
import {
    links
  } from "../database/database-sample.mjs";

export const addToCart = async (req, res) => {
    const { productId, quantity, title, price } = req.body;
    try {
        const cart = await Cart.findOne({ userId: req.user._id }) || new Cart({ userId: req.user._id });
        cart.items.push({ productId, title, quantity, price });
        await cart.save();
        res.redirect('/cart');
    } catch (error) {
        res.status(500).send('Error adding to cart');
    }
};

export const updateCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        console.log("updateCart cart", cart);
        const product = cart.items.find(p => p.productId.toString() === productId);
        console.log("updateCart product", product);
        if (product) {
            product.quantity = quantity;
            await cart.save();
            res.redirect('/cart');
        } else {
            res.status(404).send('Product not found in cart');
        }
    } catch (error) {
        res.status(500).send('Error updating cart');
    }
};

export const removeFromCart = async (req, res) => {
    const { productId } = req.body;
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        cart.items = cart.items.filter(p => p.productId.toString() !== productId);
        await cart.save();
        res.status(200).redirect('/cart');
    } catch (error) {
        res.status(500).send('Error removing from cart');
    }
};

export const getCart = async (req, res) => {
    const navigation = links.filter((link) => link.role.includes("user"));
    const pageObject = {
      redirection: "/cart",
      title: "Cart",
      navigation,
    };
    if (req.user && req.user._id) {
        pageObject['userId'] = req.user._id;
      }
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        console.log("cart", cart);
        res.render('cart', { data: cart.items, ...pageObject });
        } catch (error) {
            res.status(500).send(error);
        }
};