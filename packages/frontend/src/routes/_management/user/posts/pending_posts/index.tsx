import { nprogress } from "@mantine/nprogress";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_management/user/posts/pending_posts/")({
  onEnter: () => {
    nprogress.complete();
  },
  onLeave: () => {
    nprogress.start();
  },
  component: () => <div>Hello /_management/user/posts/pending_posts/!</div>,
});
