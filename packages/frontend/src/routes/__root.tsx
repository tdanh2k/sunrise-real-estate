import { createRootRoute, Outlet } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const TanStackRouterDevtools =
  //process.env?.["NODE_ENV"] === "production"
  import.meta.env.DEV
    ? () => null // Render nothing in production
    : lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        }))
      );

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  ),
});
