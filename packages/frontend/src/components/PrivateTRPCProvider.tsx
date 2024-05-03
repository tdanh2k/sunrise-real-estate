import { AppState, Auth0Context, Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { privateRoute } from "@utils/trpc";
import { FC, ReactNode } from "react";
import superjson from "superjson";

export const privateQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export const PrivateTRPCProvider: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  // const match = useMatch({ from: "/management" });
  const onRedirectCallback = (appState?: AppState) => {
    window.location.replace(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      //useCookiesForTransactions
      //cacheLocation="localstorage"
      //useRefreshTokens
      //cookieDomain="localhost"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      <Auth0Context.Consumer>
        {({ getAccessTokenSilently }) => (
          <privateRoute.Provider
            client={privateRoute.createClient({
              links: [
                httpBatchLink({
                  url: "http://localhost:3000/private",
                  // You can pass any HTTP headers you wish here
                  async headers() {
                    const token = await getAccessTokenSilently();
                    return {
                      authorization: `Bearer ${token}`,
                    };
                  },
                  transformer: superjson,
                }),
              ],
            })}
            queryClient={privateQueryClient}
          >
            <QueryClientProvider client={privateQueryClient}>
              {children}
              {/* {match && <ReactQueryDevtools />} */}
            </QueryClientProvider>
          </privateRoute.Provider>
        )}
      </Auth0Context.Consumer>
    </Auth0Provider>
  );
};
