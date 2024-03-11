import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import "dotenv/config.js";

import { appRouter } from "./routers/server.js";
import helmet from "helmet";
import { errorHandler } from "./middlewares/error.middleware.js";
import { notFoundHandler } from "./middlewares/not-found.middleware.js";
import cors from "cors";

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context

const app = express();
const port = 3000;

app.use(
  cors({
    //origin: "http://localhost:3000",
    methods: ["GET"],
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 86400,
  })
);

app.use(
  helmet({
    hsts: {
      maxAge: 31536000,
    },
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        "default-src": ["'none'"],
        "frame-ancestors": ["'none'"],
      },
    },
    frameguard: {
      action: "deny",
    },
  })
);

app.get("/", async (req, res) => {
  res.json({ message: "this is a public route" });
});

app.use(
  "/trpc",
  //validateAccessToken,
  //checkRequiredPermissions(["use:trpc"]),
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.use(errorHandler);
app.use(notFoundHandler);

app.listen(port, () => {
  console.log(
    `sunrise-real-estate-backend listening on http://localhost:${port}`
  );
});
