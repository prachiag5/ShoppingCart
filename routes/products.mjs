import express from "express";
import { products } from "../database/database-sample.mjs";
import Product from "../models/product.mjs";
import { PageController } from "../controller/page.mjs";
export const productsRouter = express.Router();


productsRouter.get("/", (req, res) => {
  PageController.getProducts('/product', '/product', 'Products', req, res); 
});



productsRouter.get("/:code", (req, res) => {
  const { code } = req.params;
  Product.findByCode(code).then(product => {
    res.status(200).json({ data: { product } });
  });
});

productsRouter.post("/", async (req, res) => {
  console.log("inside post request");
  const { code, title, price, description, category, imageUrl, promotion, stock } =
    req.body;
  const product = new Product({
    code,
    title,
    price,
    description,
    category,
    imageUrl,
    promotion,
    stock
});
  // use try catch block to handle error
  const data = await product.save();
  res.status(201).json({ data: { data } });
});

productsRouter.delete("/", (req, res) => {
  const { code } = req.body;
  products = products.filter((item) => item.code === code);
  res.status(201).json({ data: { data } });
});
