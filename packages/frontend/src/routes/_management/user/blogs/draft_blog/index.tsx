import { nprogress } from "@mantine/nprogress";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_management/user/blogs/draft_blog/")({
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
