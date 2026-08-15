const express = require("express");
const logger = require("./src/middlewares/logger");
const cors = require("cors");
const { routes } = require("./src/routes/index");
const { env } = require("./src/config/env");

const app = express();

app.use(express.json());
app.use(logger);
app.use(
  cors({
    origin: env.clientUrl,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use("/api/v1", routes);

module.exports = app;
