import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_management/user/posts/pending_posts/")({
  component: () => <div>Hello /_management/user/posts/pending_posts/!</div>,
});
