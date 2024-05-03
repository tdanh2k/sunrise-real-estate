import {
  createTRPCClient,
  createTRPCReact,
  httpBatchLink,
} from "@trpc/react-query";
import type {
  AppRouter,
  PublicAppRouter,
} from "@sunrise-backend/src/routers/index";
import SuperJSON from "superjson";
import { Auth0ContextInterface, User } from "@auth0/auth0-react";

export const publicRoute = createTRPCReact<PublicAppRouter>();
export const privateRoute = createTRPCReact<AppRouter>();

export const publicClient = createTRPCClient<PublicAppRouter>({
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
});

export const createPrivateClient = ({
  getAccessTokenSilently,
}: Auth0ContextInterface<User>) =>
  createTRPCClient<AppRouter>({
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
        transformer: SuperJSON,
      }),
    ],
  });
