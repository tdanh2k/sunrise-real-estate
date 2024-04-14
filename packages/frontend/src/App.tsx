import { RouterProvider, createRouter } from "@tanstack/react-router";
import { CustomAuth0Provider } from "@components/Auth0";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <CustomAuth0Provider>
      <RouterProvider router={router} />
    </CustomAuth0Provider>
  );
}

export default App;
