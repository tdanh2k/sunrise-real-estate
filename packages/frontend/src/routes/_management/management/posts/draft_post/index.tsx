import { nprogress } from "@mantine/nprogress";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_management/management/posts/draft_post/"
)({
  onEnter: () => {
    nprogress.complete();
  },
  onLeave: () => {
    nprogress.start();
  },
  component: () => {
    return <></>;
  },
});
