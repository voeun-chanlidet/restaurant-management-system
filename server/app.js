const express = require("express");
const cors = require("cors");
const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const prisma = require("./prisma");

const app = express();

app.use(express.json());
app.use(middleware.requestLogger);
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

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
module.exports = app;
