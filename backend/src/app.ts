import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";

import { apiRoutes } from "./routes/index.js";
import { notFoundMiddleware } from "./middleware/notFoundMiddleware.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

export const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);

app.use(express.json());

if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

app.use("/api", apiRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
