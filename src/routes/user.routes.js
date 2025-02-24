import { Router } from "express";
import { userAuthentication } from "../middlewares/authentication.js";
import { fetchUserProfile } from "../controllers/user.controller.js";

const userRoutes = Router();

userRoutes.get("/profile", userAuthentication, fetchUserProfile);

export default userRoutes;
