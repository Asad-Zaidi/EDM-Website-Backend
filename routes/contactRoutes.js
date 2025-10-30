import express from "express";
import { getContact, updateContact } from "../controllers/contactController.js";

const router = express.Router();

router.get("/", getContact); // public
router.put("/", updateContact); // admin edit (secure later)

export default router;
