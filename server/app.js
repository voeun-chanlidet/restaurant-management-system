const express = require("express");
const logger = require("./src/middlewares/logger");
const cors = require("cors");
const { routes } = require("./src/routes/index");

const app = express();

app.use(express.json());
app.use(logger);
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use("/api/v1", routes);

module.exports = app;
