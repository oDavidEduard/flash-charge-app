import express from "express";
import { register, login, verifyToken } from "../controllers/authControllers.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/verify", authMiddleware, verifyToken);

export default router;