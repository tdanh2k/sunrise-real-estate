import { Auth0Provider } from "@auth0/auth0-react";
import { FC, ReactNode } from "react";

export const CustomAuth0Provider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  // const onRedirectCallback = (appState?: AppState) => {
  //   window.location.replace(appState?.returnTo || window.location.pathname);
  // };

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      useCookiesForTransactions
      cacheLocation="localstorage"
      useRefreshTokens
      //cookieDomain="localhost"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        //scope: "profile email read:users read:user_idp_tokens",
      }}
      //onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};
