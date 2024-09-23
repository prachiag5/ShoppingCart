import express from "express";
import bp from "body-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import session from "express-session";
import http from "http";
import { Server } from "socket.io";
import { ensureAuthenticated } from "./middleware/authMiddleware.mjs";
import { cartRouter } from "./routes/cart.mjs";
import { productsRouter } from "./routes/products.mjs";
import { authRouter } from "./routes/auth.mjs";
import { pageRouter } from "./routes/page.mjs";
import { mongoConnect } from "./database/database.mjs";
import Cart from './models/cart.mjs';
dotenv.config();
const PORT = process.env.port || "4000";
const localHost = "localhost";
const { urlencoded, json } = bp;
console.log("jwt token", process.env.JWT_SECRET, process.env.MONGO_URI);
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// Initialize template engine
app.set("view engine", "ejs");
app.set("views", "pages");

// use middleware
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(morgan("dev"));

// Sessions
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/cart", ensureAuthenticated, cartRouter);
app.use("/product", ensureAuthenticated, productsRouter);
app.use("/auth", authRouter);
app.use("/register", authRouter);
// Page router
app.use("/", pageRouter);

mongoConnect(() => {
  // server.listen(PORT, () => {
  //   console.log(`Server is running on http://${localHost}:${PORT}`);
  // });
  console.log("mongodb connected");
});

io.on("connection", (socket) => {
  // Listen for cart update events from clients
  socket.on("addToCart", async ({ productId, title, price, userId }) => {
    console.log("add to cart");
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If no cart exists, create a new one
      cart = new Cart({ userId, items: [] });
    }
    console.log("cart", cart.items);
    // Check if the product already exists in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.equals(productId)
    );
    console.log("cart index", itemIndex);
    if (itemIndex > -1) {
      // If the item exists, increase the quantity
      cart.items[itemIndex].quantity += 1;
    } else {
      // If the item does not exist, add it with quantity 1
      cart.items.push({ productId, quantity: 1, title, price });
    }

    // Save the updated cart to the database
    await cart.save();

    // Emit the updated cart to the user
    socket.emit("cartUpdated", { userId, cart: cart.items });
  });
  socket.on("deleteCart", async ({ productId, userId }) => {
    let cart = await Cart.findOne({ userId });
    if (cart) {
      // Find the item by productId and remove it
      cart.items = cart.items.filter(item => item.productId.equals(productId));
      await cart.save();

    // Emit the updated cart to the user
    socket.emit("cartUpdated", { userId, cart: cart.items });
  }
  });
  socket.on("updateCart", async ({ productId, action, userId }) => {
    // Update cart in MongoDB
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    const itemIndex = cart.items.findIndex((item) => item.productId.equals(productId));
    if (action === 'add') {
      if (itemIndex > -1) {
        // If the item exists, increase the quantity
        cart.items[itemIndex].quantity += 1;
      } else {
        // If the item doesn't exist, add it with quantity 1
        cart.items.push({ productId, quantity: 1 });
      }
    }
    else if (action === 'decrease') {
      if (itemIndex > -1) {
        // Decrease the quantity, and if it reaches 0, remove the item
        cart.items[itemIndex].quantity -= 1;
        if (cart.items[itemIndex].quantity <= 0) {
          cart.items.splice(itemIndex, 1);
        }
      }
    }
    await cart.save();
    // Emit updated cart to all clients (or specific users if needed)
    io.emit("cartUpdated", { userId, cart });
  });
  // Handle client disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://${localHost}:${PORT}`);
});
