import express from "express";
import { chargerList, getCharger } from "../controllers/chargerController.js";

const router = express.Router();

router.get("/", chargerList);
router.get("/:id", getCharger);

export default router;

