import { Auth0Context } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "@tanstack/react-router";
import { httpBatchLink } from "@trpc/client";
import { publicRoute } from "@utils/trpc";
import { FC } from "react";
import SuperJSON from "superjson";

export const publicQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export const PublicTRPCProvider: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  // const match = useMatch({ from: "/_client" });
  return (
    <Auth0Context.Consumer>
      {() => (
        <publicRoute.Provider
          client={publicRoute.createClient({
            links: [
              httpBatchLink({
                url: "http://localhost:3000/public",
                // You can pass any HTTP headers you wish here
                // async headers() {
                //   const token = await getAccessTokenSilently({
                //     authorizationParams: {
                //       redirect_uri: window.location.origin,
                //     },
                //   });
                //   return {
                //     authorization: `Bearer ${token}`,
                //   };
                // },
                transformer: SuperJSON,
              }),
            ],
          })}
          queryClient={publicQueryClient}
        >
          <QueryClientProvider client={publicQueryClient}>
            {children}
            {/* {match && <ReactQueryDevtools />} */}
          </QueryClientProvider>
        </publicRoute.Provider>
      )}
    </Auth0Context.Consumer>
  );
};
