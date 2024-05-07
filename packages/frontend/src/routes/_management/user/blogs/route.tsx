import { NotFoundComponent } from "@routes/-components/NotFound";
import { IconBrandBlogger } from "@tabler/icons-react";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_management/user/blogs")({
  staticData: {
    routeName: "Quản lý blog cá nhân",
    icon: <IconBrandBlogger />,
  },
  component: () => <Outlet />,
  notFoundComponent: NotFoundComponent ,
});
