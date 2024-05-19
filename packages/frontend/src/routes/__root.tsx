import { Auth0ContextInterface, User } from "@auth0/auth0-react";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { Outlet, RouteContext } from "@tanstack/react-router";
import { lazy } from "react";
import { NotFoundComponent } from "./-components/NotFound";
import { ErrorComponent } from "./-components/Error";
import { LoadingOverlay } from "@mantine/core";

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
  wrapInSuspense: true,
  pendingComponent: () => (
    <LoadingOverlay
      visible={true}
      zIndex={1000}
      overlayProps={{ radius: "sm", blur: 2 }}
    />
  ),
  // onEnter: (match) => {
  //   console.log("Test")
  // },
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
