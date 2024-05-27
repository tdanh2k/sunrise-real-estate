import { Banner } from "./-components/Banner";
import { BestBlogList } from "./-components/BestBlogList";
import { PostList } from "./-components/PostList";
//import { References } from "./-components/References";
import { Subscribe } from "./-components/Subscribe";
import { TeamList } from "./-components/TeamList";
import { createFileRoute } from "@tanstack/react-router";
import { LoadingOverlay } from "@mantine/core";

export const Route = createFileRoute("/_client/")({
  wrapInSuspense: true,
  pendingComponent: () => (
    <LoadingOverlay
      visible={true}
      zIndex={1000}
      overlayProps={{ radius: "sm", blur: 2 }}
    />
  ),
  component: () => {
    return (
      <>
        <Banner />
        <PostList />
        <BestBlogList />
        <Subscribe />
        <TeamList />
        {/* <References /> */}
      </>
    );
  },
});
