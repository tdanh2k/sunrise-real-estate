import { createTRPCReact } from "@trpc/react-query";
import type {
  AppRouter,
  PublicAppRouter,
} from "@sunrise-backend/src/routers/index";

export const publicRoute = createTRPCReact<PublicAppRouter>();
export const privateRoute = createTRPCReact<AppRouter>();
