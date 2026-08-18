require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const spaceRoutes = require("./routes/spaceRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/spaces", spaceRoutes);
app.use("/api/reservations", reservationRoutes);

// Manejador de errores genérico
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Error interno del servidor" });
});

const PORT = process.env.PORT || 4000;

if (require.main === module) {
  connectDB()
    .then(() => app.listen(PORT, () => console.log(`SIRA API escuchando en puerto ${PORT}`)))
    .catch((err) => {
      console.error("Error al conectar a MongoDB:", err.message);
      process.exit(1);
    });
}

module.exports = app; // exportado para pruebas con Supertest
