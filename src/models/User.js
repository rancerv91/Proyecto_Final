const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// RF01, RF02 - registro y autenticación de usuarios con rol
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      // Ajusta el dominio institucional según tu universidad (RF01 - HU01)
      match: [/^[\w.+-]+@[\w-]+\.(edu\.do|edu)$/, "Debe usar un correo institucional válido"],
    },
    password: { type: String, required: true, minlength: 8 },
    role: {
      type: String,
      enum: ["estudiante", "profesor", "administrador"],
      default: "estudiante",
    },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

module.exports = mongoose.model("User", userSchema);
