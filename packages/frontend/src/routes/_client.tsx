import { FC } from "react";
import { Header } from "./_client/-components/Header";
import { Footer } from "./_client/-components/Footer";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { PublicTRPCProvider } from "@components/PublicTRPCProvider";

import "./client.css";
import { NotFoundComponent } from "./_management/-components/NotFound";

export const ClientLayout: FC = () => {
  return (
    <PublicTRPCProvider>
      <Header />
      <Outlet />
      <Footer />
    </PublicTRPCProvider>
  );
};

export const Route = createFileRoute("/_client")({
  component: ClientLayout,
  notFoundComponent: () => <NotFoundComponent />,
});
