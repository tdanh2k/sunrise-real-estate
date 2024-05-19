import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import "dotenv/config.js";

import { appRouter, publicAppRouter } from "./routers/index.js";
import helmet from "helmet";
import cors from "cors";
import { createTRPCContext } from "./routers/context.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { notFoundHandler } from "./middlewares/not-found.middleware.js";
import { validateAccessToken } from "./middlewares/auth0.middleware.js";
import { v2 as cloudinary } from "cloudinary";
import { ManagementClient } from "auth0";

const app = express();
const port = process.env.port || 8080;

export const auth0Management = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN?.replace(/^https?\:\/\//i, "") ?? "",
  clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID ?? "",
  clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET ?? "",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

app.use(
  cors({
    //origin: "http://localhost:3000",
    methods: ["GET"],
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 86400,
  })
);

app.use(
  express.json({
    limit: "100mb",
  })
);
// app.set("json spaces", 2);

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
  res.json({ message: "Test" });
});

app.use(
  "/private",
  validateAccessToken,
  //checkRequiredPermissions(["use:trpc"]),
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createTRPCContext,
  })
);

app.use(
  "/public",
  trpcExpress.createExpressMiddleware({
    router: publicAppRouter,
    createContext: createTRPCContext,
  })
);

// Serve Swagger UI with our OpenAPI schema
// app.use(
//   "/api-docs",
//   (req: Request, res: Response, next: NextFunction) => {
//     res?.set("Content-Security-Policy", `script-src 'self'`);
//     next();
//   },
//   swaggerUi.serve,
//   swaggerUi.setup(openApiDocument, {
//     isExplorer: true,
//   })
// );

app.use(errorHandler);
app.use(notFoundHandler);

app.listen(port, () => {
  console.log(
    `- sunrise-real-estate-backend listening on http://localhost:${port}.
` //- Access Swagger docs at http://localhost:${port}/api-docs
  );
});
