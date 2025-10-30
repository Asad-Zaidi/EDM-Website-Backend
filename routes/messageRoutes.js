import express from "express";
import { sendMessage } from "../controllers/contactController.js";

const router = express.Router();

router.post("/", sendMessage); // Public form submission route

export default router;
