const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/sira";
  await mongoose.connect(uri);
  console.log("MongoDB conectado:", uri);
}

module.exports = connectDB;
