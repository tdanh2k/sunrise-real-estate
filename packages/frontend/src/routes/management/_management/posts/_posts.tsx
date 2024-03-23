import { Outlet, createFileRoute } from "@tanstack/react-router";
import { FC } from "react";

export const PostsLayout: FC = () => {
  return <Outlet />;
};

export const Route = createFileRoute("/management/_management/posts/_posts")({
  component: PostsLayout,
});
