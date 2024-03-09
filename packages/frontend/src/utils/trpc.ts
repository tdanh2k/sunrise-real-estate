import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "sunrise-real-estate-backend/src/routers/server";

export const trpc = createTRPCReact<AppRouter>();
