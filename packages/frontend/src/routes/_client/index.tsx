import { Banner } from "./-components/Banner";
import { BestPostList } from "./-components/BestPostList";
import { PostList } from "./-components/PostList";
//import { References } from "./-components/References";
import { Subscribe } from "./-components/Subscribe";
import { TeamList } from "./-components/TeamList";
import { createFileRoute } from "@tanstack/react-router";

const Home = () => {
  return (
    <>
      <Banner />
      <PostList />
      <BestPostList />
      <Subscribe />
      <TeamList />
      {/* <References /> */}
    </>
  );
};

export const Route = createFileRoute("/_client/")({
  component: Home,
});
