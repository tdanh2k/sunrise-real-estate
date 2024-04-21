import { Auth0ContextInterface, User } from "@auth0/auth0-react";
import { MantineProvider } from "@mantine/core";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { Outlet, RouteContext } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import "@mantine/core/styles.css"; //import Mantine V7 styles needed by MRT
import "@mantine/dates/styles.css"; //if using mantine date picker features
import "@mantine/nprogress/styles.css";
import "mantine-react-table/styles.css"; //import MRT styles

const TanStackRouterDevtools =
  //process.env?.NODE_ENV === "production"
  import.meta.env.PROD
    ? () => null // Render nothing in production
    : lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        }))
      );

type RootRouteContext = RouteContext & {
  auth0: Auth0ContextInterface<User>;
};

export const Route = createRootRouteWithContext<RootRouteContext>()({
  component: () => (
    <MantineProvider>
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </MantineProvider>
  ),
});
