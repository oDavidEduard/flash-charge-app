import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { adminMiddleware } from "../middleware/admin.js";
import { createRequest, listMyRequests, listPendingRequests, aproveRequest, rejectRequest } from "../controllers/requestsControllers.js";

const router = express.Router();

router.post("/", authMiddleware, createRequest);
router.get("/my", authMiddleware, listMyRequests);
router.get("/pending", authMiddleware, listPendingRequests);
router.put("/:id/approve", authMiddleware, adminMiddleware, aproveRequest);
router.put("/:id/reject", authMiddleware, adminMiddleware, rejectRequest);

export default router;