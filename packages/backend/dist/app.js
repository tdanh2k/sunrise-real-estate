"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const trpcExpress = __importStar(require("@trpc/server/adapters/express"));
require("dotenv/config.js");
const index_js_1 = require("./routers/index.js");
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const context_1 = require("./routers/context");
const error_middleware_js_1 = require("./middlewares/error.middleware.js");
const not_found_middleware_js_1 = require("./middlewares/not-found.middleware.js");
const auth0_middleware_js_1 = require("./middlewares/auth0.middleware.js");
const cloudinary_1 = require("cloudinary");
const app = (0, express_1.default)();
const port = 3000;
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});
app.use((0, cors_1.default)({
    //origin: "http://localhost:3000",
    methods: ["GET"],
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 86400,
}));
app.use(express_1.default.json({
    limit: "100mb",
}));
// app.set("json spaces", 2);
app.use((0, helmet_1.default)({
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
}));
// app.get("/", async (req, res) => {
//   res.json({ message: "Test" });
// });
app.use("/private", auth0_middleware_js_1.validateAccessToken, 
//checkRequiredPermissions(["use:trpc"]),
trpcExpress.createExpressMiddleware({
    router: index_js_1.appRouter,
    createContext: context_1.createTRPCContext,
}));
app.use("/public", trpcExpress.createExpressMiddleware({
    router: index_js_1.publicAppRouter,
    createContext: context_1.createTRPCContext,
}));
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
app.use(error_middleware_js_1.errorHandler);
app.use(not_found_middleware_js_1.notFoundHandler);
app.listen(port, () => {
    console.log(`- sunrise-real-estate-backend listening on http://localhost:${port}.
` //- Access Swagger docs at http://localhost:${port}/api-docs
    );
});
