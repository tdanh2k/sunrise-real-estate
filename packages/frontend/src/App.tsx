import { RouterProvider, createRouter } from "@tanstack/react-router";
import { CustomAuth0Provider } from "@components/Auth0";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { Auth0Context, Auth0ContextInterface, User } from "@auth0/auth0-react";

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
}

function App() {
  return (
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
  );
}

export default App;
