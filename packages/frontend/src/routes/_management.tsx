import { FC } from "react";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { Header } from "./_management/-components/Header";
import { NavBar } from "./_management/-components/NavBar";
import { PrivateTRPCProvider } from "@components/PrivateTRPCProvider";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { NotFoundComponent } from "./_management/-components/NotFound";
import { NavigationProgress } from "@mantine/nprogress";

export const ManagementLayout: FC = () => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <PrivateTRPCProvider>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <NavigationProgress />
        <Header opened={opened} toggle={toggle} />

        <NavBar />
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </PrivateTRPCProvider>
  );
};

export const Route = createFileRoute("/_management")({
  component: withAuthenticationRequired(ManagementLayout, {
    returnTo: "/",
    onRedirecting: () => <div>Redirecting...</div>,
  }),
  notFoundComponent: () => <NotFoundComponent />,
});
