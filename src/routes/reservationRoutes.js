const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const requireRole = require("../middleware/role");
const {
  createReservation, getSpaceCalendar, listPending,
  reviewReservation, cancelReservation, usageReport,
} = require("../controllers/reservationController");

router.post("/", requireAuth, createReservation);                                     // HU05
router.get("/calendar/:spaceId", requireAuth, getSpaceCalendar);                      // HU08
router.get("/pending", requireAuth, requireRole("administrador"), listPending);        // HU06
router.patch("/:id/review", requireAuth, requireRole("administrador"), reviewReservation); // HU06
router.patch("/:id/cancel", requireAuth, cancelReservation);                          // HU07
router.get("/report", requireAuth, requireRole("administrador"), usageReport);         // HU10

module.exports = router;
