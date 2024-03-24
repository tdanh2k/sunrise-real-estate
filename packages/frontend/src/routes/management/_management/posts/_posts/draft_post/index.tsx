import { createFileRoute } from "@tanstack/react-router";
import { FC } from "react";

const DraftPost: FC = () => {
  return <></>;
};

export const Route = createFileRoute("/management/_management/posts/_posts/draft_post/")({
  component: DraftPost,
});
