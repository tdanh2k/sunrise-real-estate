import { createFileRoute } from "@tanstack/react-router";
import { FC } from "react";

const PostDetail: FC = () => {
  return <></>;
};

export const Route = createFileRoute("/management/_management/posts/_posts/post_detail")({
  component: PostDetail,
});
