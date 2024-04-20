import { NotFoundComponent } from "@routes/_management/-components/NotFound";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_management/user/blogs")({
  component: () => <Outlet />,
  notFoundComponent: () => <NotFoundComponent />,
});
