import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_management/user/posts")({
  component: () => <Outlet />,
});
