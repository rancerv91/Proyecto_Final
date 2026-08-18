const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const requireRole = require("../middleware/role");
const {
  listSpaces, getSpace, createSpace, updateSpace, deleteSpace,
} = require("../controllers/spaceController");

router.get("/", requireAuth, listSpaces);                                   // HU03
router.get("/:id", requireAuth, getSpace);
router.post("/", requireAuth, requireRole("administrador"), createSpace);    // HU04
router.put("/:id", requireAuth, requireRole("administrador"), updateSpace);  // HU04
router.delete("/:id", requireAuth, requireRole("administrador"), deleteSpace); // HU04

module.exports = router;
