const express = require("express");
const { addCategory, getCategories, deleteCategory } = require("../controllers/categoryController");

const router = express.Router();

router.get("/", getCategories);
router.post("/add", addCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
