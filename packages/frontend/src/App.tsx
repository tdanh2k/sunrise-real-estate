import { RouterProvider, createRouter } from "@tanstack/react-router";
import { CustomAuth0Provider } from "@components/Auth0";

import "@mantine/core/styles.css"; //import Mantine V7 styles needed by MRT
import "@mantine/dates/styles.css"; //if using mantine date picker features
import "@mantine/nprogress/styles.css";
import "mantine-react-table/styles.css"; //import MRT styles

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { Auth0Context, Auth0ContextInterface, User } from "@auth0/auth0-react";
import { MantineProvider } from "@mantine/core";

// Create a new router instance
const router = createRouter({
  routeTree,
  //defaultPreload: "intent",
  context: {
    auth0: {} as Auth0ContextInterface<User>,
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
  interface StaticDataRouteOption {
    routeName?: string;
    icon?: JSX.Element;
    // icon?: ForwardRefExoticComponent<
    //   Omit<IconProps, "ref"> & RefAttributes<Icon>
    // >;
  }
}

function App() {
  return (
    <MantineProvider>
      <CustomAuth0Provider>
        <Auth0Context.Consumer>
          {(props) => (
            <RouterProvider
              router={router}
              context={{
                auth0: props,
              }}
            />
          )}
        </Auth0Context.Consumer>
      </CustomAuth0Provider>
    </MantineProvider>
  );
}

export default App;
