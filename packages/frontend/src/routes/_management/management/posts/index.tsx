import { createFileRoute } from "@tanstack/react-router";
import { privateRoute } from "@utils/trpc";
import { FC } from "react";

export const PostIndexPage: FC = () => {
  const { data } = privateRoute.management.admin_user.byPage.useQuery({
    paging: {
      page_index: 1,
      page_size: 50
    },
  });
  console.log(data);
  return <></>;
};

export const Route = createFileRoute("/_management/management/posts/")({
  component: PostIndexPage,
});
