const express = require("express");
const cors = require("cors");
const { routes } = require("./src/routes/index");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://192.168.0.108:5173",
    ].filter(Boolean), // removes undefined if FRONTEND_URL isn't set
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/v1", routes);

module.exports = app;
