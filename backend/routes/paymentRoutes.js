import express from "express";
import { paychanguWebhook } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/webhook", paychanguWebhook);

export default router;
