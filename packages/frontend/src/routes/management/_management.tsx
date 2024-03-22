import { FC } from "react";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import { Header } from "./-components/Header";
import { NavBar } from "./-components/NavBar";

export const ClientLayout: FC = () => {
  const [opened, { toggle }] = useDisclosure();

  return (
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
        <Header opened={opened} toggle={toggle} />
        <NavBar />
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
};

export const Route = createFileRoute("/management/_management")({
  component: ClientLayout,
  notFoundComponent: () => <h1>Not found</h1>,
});
