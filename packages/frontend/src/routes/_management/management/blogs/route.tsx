import { IconBrandBlogger } from "@tabler/icons-react";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_management/management/blogs")({
  staticData: {
    routeName: "Quản lý blog",
    icon: <IconBrandBlogger />,
  },
  component: () => <Outlet />,
});
