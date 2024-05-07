import { IconNews } from "@tabler/icons-react";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_management/user/posts")({
  staticData: {
    routeName: "Quản lý bài đăng cá nhân",
    icon: <IconNews />,
  },
  component: () => <Outlet />,
});
