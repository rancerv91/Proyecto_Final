const mongoose = require("mongoose");

// RF04-RF09 - solicitud, aprobación, cancelación y calendario (HU05-HU08)
const reservationSchema = new mongoose.Schema(
  {
    space: { type: mongoose.Schema.Types.ObjectId, ref: "Space", required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    purpose: { type: String, required: true },
    status: {
      type: String,
      enum: ["pendiente", "aprobada", "rechazada", "cancelada"],
      default: "pendiente",
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewComment: { type: String, default: "" },
    cancelReason: { type: String, default: "" },
  },
  { timestamps: true }
);

reservationSchema.index({ space: 1, startTime: 1, endTime: 1 });

module.exports = mongoose.model("Reservation", reservationSchema);
