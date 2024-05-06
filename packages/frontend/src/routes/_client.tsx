import { Header } from "./_client/-components/Header";
import { Footer } from "./_client/-components/Footer";
import {
  ErrorComponent,
  Outlet,
  createFileRoute,
} from "@tanstack/react-router";
import { PublicTRPCProvider } from "@components/PublicTRPCProvider";

import "./client.css";
import { NotFoundComponent } from "./-components/NotFound";

export const Route = createFileRoute("/_client")({
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
  component: () => {
    return (
      <PublicTRPCProvider>
        <Header />
        <Outlet />
        <Footer />
      </PublicTRPCProvider>
    );
  },
});
