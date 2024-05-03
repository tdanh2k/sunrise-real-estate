import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_management/management/blogs")({
  component: () => <Outlet />,
});
