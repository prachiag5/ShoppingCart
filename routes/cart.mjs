import express from 'express';
import { addToCart, updateCart, removeFromCart, getCart } from '../controller/cartController.mjs';
export const cartRouter = express.Router();

cartRouter.get('/', getCart);
cartRouter.post('/add', addToCart);
cartRouter.post('/update', updateCart);
cartRouter.post('/delete', removeFromCart);