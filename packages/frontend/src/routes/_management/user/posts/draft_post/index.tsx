import { createFileRoute } from "@tanstack/react-router";
import { FC } from "react";

const DraftPost: FC = () => {
  return <></>;
};

export const Route = createFileRoute("/_management/user/posts/draft_post/")({
  component: DraftPost,
});
