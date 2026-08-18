const mongoose = require("mongoose");

// RF03, RF04(admin) - catálogo de auditorios y salones (HU03, HU04)
const spaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["auditorio", "salon"], required: true },
    capacity: { type: Number, required: true, min: 1 },
    location: { type: String, required: true },
    equipment: [{ type: String }],
    imageUrl: { type: String, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Space", spaceSchema);
