import express from 'express';
import { login, register } from "../controller/userController.mjs";
export const authRouter = express.Router();

authRouter.post("/login", (req, res) => {
    login(req, res); 
});

authRouter.post("/register", (req, res) => {
    register(req, res);
});