import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";

const authRoutes = Router();

authRoutes.route("/register").post(registerUser);

authRoutes.route("/login").post(loginUser);

export default authRoutes;
