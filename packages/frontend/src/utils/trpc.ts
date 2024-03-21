import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "sunrise-real-estate-backend/src/routers/index";

export const trpc = createTRPCReact<AppRouter>();
