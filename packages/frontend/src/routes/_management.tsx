import { FC } from "react";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import "@mantine/core/styles.css"; //import Mantine V7 styles needed by MRT
import "@mantine/dates/styles.css"; //if using mantine date picker features
import "@mantine/nprogress/styles.css";
import "mantine-react-table/styles.css"; //import MRT styles

import { MantineProvider } from "@mantine/core";
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
      <MantineProvider>
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
      </MantineProvider>
    </PrivateTRPCProvider>
  );
};

export const Route = createFileRoute("/_management")({
  component: withAuthenticationRequired(ManagementLayout, {
    returnTo: "/_management/management",
    onRedirecting: () => <div>Redirecting...</div>,
  }),
  notFoundComponent: () => <NotFoundComponent />,
});
