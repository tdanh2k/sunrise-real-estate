import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@sunrise-backend/src/routers/index";

export const trpc = createTRPCReact<AppRouter>();
