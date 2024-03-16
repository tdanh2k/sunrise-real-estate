import { FC } from "react";
import { Header } from "./-components/Header";
import { Footer } from "./-components/Footer";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const ClientLayout: FC = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export const Route = createFileRoute("/_client")({
  component: ClientLayout,
  notFoundComponent: () => <h1>Not found</h1>
});
