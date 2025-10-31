import express from "express";
import { getContact, updateContact } from "../controllers/contactController.js";

const router = express.Router();

router.get("/", getContact); 
router.put("/", updateContact); 

module.exports = router;
