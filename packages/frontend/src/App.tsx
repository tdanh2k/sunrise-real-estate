import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Auth0WithTRPC } from "@components/Auth0WithTRPC";

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
    <Auth0WithTRPC>
      <RouterProvider router={router} />
    </Auth0WithTRPC>
  );
}

export default App;
