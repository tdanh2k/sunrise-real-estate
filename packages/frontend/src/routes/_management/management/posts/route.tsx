import { IconNews } from "@tabler/icons-react";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_management/management/posts")({
  staticData: {
    routeName: "Quản lý bài đăng",
    icon: <IconNews />,
  },
  component: () => <Outlet />,
});
