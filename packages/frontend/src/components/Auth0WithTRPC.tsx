import { Auth0Context, Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "@utils/trpc";
import { FC, ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export const Auth0WithTRPC: FC<{ children?: ReactNode }> = ({ children }) => (
  <Auth0Provider
    domain="dev-ofnrpe1wby52d4ok.us.auth0.com"
    clientId="9sJEcD99x0KKiaBxlBxnwzCaO1C4OEqo"
    useCookiesForTransactions
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "http://localhost:3000",
    }}
  >
    <Auth0Context.Consumer>
      {({ getAccessTokenSilently }) => (
        <trpc.Provider
          client={trpc.createClient({
            links: [
              httpBatchLink({
                url: "http://localhost:3000/trpc",
                // You can pass any HTTP headers you wish here
                async headers() {
                  const test = await getAccessTokenSilently();
                  return {
                    authorization: `Bearer ${test}`,
                  };
                },
              }),
            ],
          })}
          queryClient={queryClient}
        >
          <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools />
          </QueryClientProvider>
        </trpc.Provider>
      )}
    </Auth0Context.Consumer>
  </Auth0Provider>
);
