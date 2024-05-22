import { nprogress } from "@mantine/nprogress";
import { Banner } from "./-components/Banner";
import { BestBlogList } from "./-components/BestBlogList";
import { PostList } from "./-components/PostList";
//import { References } from "./-components/References";
import { Subscribe } from "./-components/Subscribe";
import { TeamList } from "./-components/TeamList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_client/")({
  onEnter: () => {
    nprogress.complete();
  },
  onLeave: () => {
    nprogress.start();
  },
  wrapInSuspense: true,
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
